import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyTransaction, isWebhookValid } from '@/lib/paychangu';

/**
 * PayChangu Webhook/Callback Handler
 * This endpoint processes asynchronous payment notifications from the PayChangu gateway.
 */
export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('Signature');
        
        if (!signature || !(await isWebhookValid(rawBody, signature))) {
             console.error('PayChangu Error: Invalid signature or missing header');
             return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = JSON.parse(rawBody);
        console.log('PayChangu Webhook Received & Verified:', body);

        // PayChangu payload format: { event: 'charge.success', data: { tx_ref: '...', ... } }
        const tx_ref = body.data?.tx_ref || body.tx_ref;

        if (!tx_ref) {
            console.error('PayChangu Error: Missing transaction reference in payload');
            return NextResponse.json({ error: 'Missing transaction reference' }, { status: 400 });
        }

        // 1. Verify with PayChangu API (Security best practice)
        // We call the gateway itself to confirm the status, ensuring the notification isn't spoofed.
        const verification = await verifyTransaction(tx_ref);

        if (verification.status !== 'success' || (verification.data && verification.data.status !== 'success' && verification.data.status !== 'completed')) {
             console.warn(`PayChangu Payment Verification Failed for ${tx_ref}:`, verification);
             
             // If we find the transaction and it's pending, mark it as failed if the gateway says so
             const existingTx = await prisma.institutionalTransaction.findUnique({
                 where: { referenceId: tx_ref }
             });
             
             if (existingTx && existingTx.status === 'PENDING') {
                 await prisma.institutionalTransaction.update({
                     where: { referenceId: tx_ref },
                     data: { status: 'FAILED' }
                 });
             }
             
             return NextResponse.json({ message: 'Transaction verification failed' }, { status: 200 });
        }

        // 2. Fetch the transaction from our database
        const transaction = await prisma.institutionalTransaction.findUnique({
            where: { referenceId: tx_ref },
            include: { 
                application: true,
                user: true
            }
        });

        if (!transaction) {
            console.error(`PayChangu Error: Transaction ${tx_ref} not found in database.`);
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // If transaction is already successful, no need to process again (Idempotency)
        if (transaction.status === 'SUCCESS') {
            return NextResponse.json({ message: 'Transaction already processed' }, { status: 200 });
        }

        // 3. Update database using a transaction
        // Mark transaction as success, update application status, and record history
        await prisma.$transaction([
            prisma.institutionalTransaction.update({
                where: { id: transaction.id },
                data: { 
                    status: 'SUCCESS',
                    gatewayReference: verification.data.reference || verification.data.id?.toString() || 'PC-VERIFIED'
                }
            }),
            prisma.application.update({
                where: { id: transaction.applicationId! },
                data: { status: 'SUBMITTED' }
            }),
            prisma.applicationStatusHistory.create({
                data: {
                    applicationId: transaction.applicationId!,
                    status: 'SUBMITTED',
                    changedBy: transaction.userId,
                    note: 'Application automatically submitted after successful PayChangu payment confirmation.',
                }
            })
        ]);

        console.log(`Payment successful for transaction ${tx_ref}. Application ${transaction.applicationId} submitted.`);
        
        return NextResponse.json({ message: 'Payment successfully processed' }, { status: 200 });
    } catch (error) {
        console.error('PayChangu Callback Internal Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Support GET requests if used as a redirect return
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const tx_ref = searchParams.get('tx_ref');
    const baseUrl = req.nextUrl.origin;
    
    if (!tx_ref) {
        console.warn('PayChangu Redirect: Missing tx_ref');
        return NextResponse.redirect(`${baseUrl}/dashboard/applications`);
    }

    try {
        console.log(`PayChangu Redirect received for ${tx_ref}. Verifying...`);

        // 1. Fetch the transaction from our database
        const transaction = await prisma.institutionalTransaction.findUnique({
            where: { referenceId: tx_ref },
            include: { application: true }
        });

        if (!transaction) {
            console.error(`PayChangu Redirect Error: Transaction ${tx_ref} not found.`);
            return NextResponse.redirect(`${baseUrl}/dashboard/applications?error=transaction_not_found`);
        }

        // 2. Verify with PayChangu API (Security best practice)
        const verification = await verifyTransaction(tx_ref);
        const isSuccessful = verification.status === 'success' && 
                           (verification.data?.status === 'success' || verification.data?.status === 'completed');

        // 3. If successful and still pending, update database
        if (isSuccessful && transaction.status === 'PENDING') {
            await prisma.$transaction([
                prisma.institutionalTransaction.update({
                    where: { id: transaction.id },
                    data: { 
                        status: 'SUCCESS',
                        gatewayReference: verification.data.reference || verification.data.id?.toString() || 'PC-VERIFIED'
                    }
                }),
                prisma.application.update({
                    where: { id: transaction.applicationId! },
                    data: { status: 'SUBMITTED' }
                }),
                prisma.applicationStatusHistory.create({
                    data: {
                        applicationId: transaction.applicationId!,
                        status: 'SUBMITTED',
                        changedBy: transaction.userId,
                        note: 'Application verified and submitted via PayChangu redirect callback.',
                    }
                })
            ]);
            console.log(`PayChangu Redirect: Successfully processed and updated transaction ${tx_ref}`);
        }

        // 4. Redirect to the application details page with a status flag
        const status = isSuccessful ? 'success' : 'failed';
        const targetUrl = `${baseUrl}/dashboard/applications/${transaction.applicationId}?payment=${status}`;
        
        return NextResponse.redirect(targetUrl);
    } catch (error) {
        console.error('PayChangu Callback GET Internal Error:', error);
        return NextResponse.redirect(`${baseUrl}/dashboard/applications?error=internal_server_error`);
    }
}
