'use server';

import crypto from 'crypto';

/**
 * PayChangu Integration Utility
 * This handles communication with the PayChangu API for processing payments and payouts.
 */

const PAYCHANGU_SECRET_KEY = process.env.PAYCHANGU_SECRET_KEY;
const PAYCHANGU_BASE_URL = 'https://api.paychangu.com';

/**
 * Initialize a dynamic checkout payment link
 * @param data Payment details (amount, currency, customer info, reference)
 */
export async function createCheckoutLink(data: {
    amount: number;
    currency: string;
    email: string;
    first_name: string;
    last_name: string;
    tx_ref: string; // Our internal referenceId
    callback_url: string;
    return_url: string;
}) {
    if (!PAYCHANGU_SECRET_KEY) {
        throw new Error('PAYCHANGU_SECRET_KEY is not configured in environment variables.');
    }

    try {
        const response = await fetch(`${PAYCHANGU_BASE_URL}/payment`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYCHANGU_SECRET_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                customization: {
                    title: "Tenpaten Admission Fee",
                    description: "Payment for university application processing",
                }
            }),
        });

        const result = await response.json();
        
        if (result.status === 'success') {
            return { success: true, checkout_url: result.data.checkout_url };
        } else {
            return { success: false, error: result.message || 'Failed to create checkout link' };
        }
    } catch (error) {
        console.error('PayChangu Error:', error);
        return { success: false, error: 'Connection to payment gateway failed' };
    }
}

/**
 * Verify a transaction status
 * @param tx_ref Internal reference or gateway reference
 */
export async function verifyTransaction(tx_ref: string) {
    if (!PAYCHANGU_SECRET_KEY) throw new Error('Missing Secret Key');

    try {
        const response = await fetch(`${PAYCHANGU_BASE_URL}/verify-payment/${tx_ref}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PAYCHANGU_SECRET_KEY}`,
                'Accept': 'application/json',
            },
        });

        const result = await response.json();
        return result; // Result will contain status 'success' and payment data if valid
    } catch (error) {
        console.error('Verification Error:', error);
        return { status: 'error', message: 'Failed to verify transaction' };
    }
}

/**
 * Validates the PayChangu webhook signature
 * @param payload Raw request body string
 * @param signature Signature from the 'Signature' header
 */
export async function isWebhookValid(payload: string, signature: string) {
    const webhookSecret = process.env.PAYCHANGU_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error('PAYCHANGU_WEBHOOK_SECRET is not configured.');
        return false;
    }

    const computedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

    return computedSignature === signature;
}
