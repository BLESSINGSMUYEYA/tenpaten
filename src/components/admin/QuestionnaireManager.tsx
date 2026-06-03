'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Edit2, X, Check, GripVertical, ClipboardList, Loader2 } from 'lucide-react';
import { upsertQuestion, deleteQuestion, moveQuestion, toggleQuestion } from '@/lib/actions/questionnaire';
import type { QuestionnaireQuestionData, QuestionOption } from '@/lib/actions/questionnaire';
import { toast } from 'sonner';

type DBQuestion = {
    id: string;
    key: string;
    title: string;
    description: string | null;
    type: string;
    category: string;
    placeholder: string | null;
    options: unknown;
    order: number;
    active: boolean;
};

const typeLabels: Record<string, string> = {
    select: 'Dropdown',
    'searchable-select': 'Searchable Dropdown',
    text: 'Free Text',
    grid: 'Grid (Cards)',
};

const categoryLabels: Record<string, string> = {
    'PROSPECT': 'Student',
    'UNIVERSITY': 'University',
};

function OptionEditor({ options, onChange }: { options: QuestionOption[]; onChange: (opts: QuestionOption[]) => void }) {
    const add = () => onChange([...options, { value: '', label: '' }]);
    const remove = (i: number) => onChange(options.filter((_, idx) => idx !== i));
    const update = (i: number, field: 'value' | 'label', val: string) => {
        const next = [...options];
        next[i] = { ...next[i], [field]: field === 'value' ? val.toLowerCase().replace(/\s+/g, '_') : val };
        onChange(next);
    };

    return (
        <div className="space-y-2">
            {options.map((opt, i) => (
                <div key={i} className="flex gap-2 items-center">
                    <input
                        value={opt.label}
                        onChange={e => update(i, 'label', e.target.value)}
                        placeholder="Label (shown to user)"
                        className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent"
                    />
                    <input
                        value={opt.value}
                        onChange={e => update(i, 'value', e.target.value)}
                        placeholder="value_key"
                        className="w-32 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent font-mono text-xs"
                    />
                    <button onClick={() => remove(i)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-all">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
            <button onClick={add} className="text-xs font-bold text-brand-primary hover:text-brand-accent flex items-center gap-1 transition-colors">
                <Plus className="w-3 h-3" /> Add Option
            </button>
        </div>
    );
}

function QuestionCard({ question, isFirst, isLast, onRefresh }: {
    question: DBQuestion;
    isFirst: boolean;
    isLast: boolean;
    onRefresh: (action: 'delete' | 'toggle' | 'move', id: string, extra?: unknown) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(false);
    const [isPending, startTransition] = useTransition();

    const opts = (question.options as QuestionOption[] | null) ?? [];
    const [editData, setEditData] = useState<QuestionnaireQuestionData>({
        id: question.id,
        key: question.key,
        title: question.title,
        description: question.description ?? '',
        type: question.type as 'select' | 'searchable-select' | 'text' | 'grid',
        category: question.category,
        placeholder: question.placeholder ?? '',
        options: opts,
        active: question.active,
    });

    const handleSave = () => startTransition(async () => {
        const result = await upsertQuestion(editData);
        if (result?.success) { toast.success('Question saved'); setEditing(false); }
        else toast.error(result?.error || 'Save failed');
    });

    const handleDelete = () => {
        if (!confirm(`Delete "${question.title}"?`)) return;
        startTransition(async () => {
            const result = await deleteQuestion(question.id);
            if (result?.success) { toast.success('Deleted'); onRefresh('delete', question.id); }
            else toast.error(result?.error);
        });
    };

    const handleToggle = () => startTransition(async () => {
        const result = await toggleQuestion(question.id, !question.active);
        if (result?.success) onRefresh('toggle', question.id, !question.active);
        else toast.error(result?.error);
    });

    const handleMove = (dir: 'up' | 'down') => startTransition(async () => {
        const result = await moveQuestion(question.id, dir);
        if (result?.success) onRefresh('move', question.id, dir);
        else toast.error(result?.error);
    });

    return (
        <div className={`bg-white rounded-2xl border shadow-sm transition-all ${question.active ? 'border-gray-100' : 'border-dashed border-gray-200 opacity-60'}`}>
            {/* Question Header */}
            <div className="p-5 flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="font-black text-brand-primary text-sm truncate">{question.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{typeLabels[question.type] || question.type}</span>
                        <span className="text-gray-200">·</span>
                        <span className="text-[10px] font-bold text-gray-400">{opts.length} options</span>
                        <span className="text-gray-200">·</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${question.active ? 'text-emerald-500' : 'text-gray-400'}`}>
                            {question.active ? 'Active' : 'Hidden'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleMove('up')} disabled={isFirst || isPending} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all">
                        <ChevronUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleMove('down')} disabled={isLast || isPending} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-all">
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button onClick={handleToggle} disabled={isPending} title={question.active ? 'Hide from users' : 'Show to users'} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all">
                        {question.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { setExpanded(true); setEditing(true); }} className="p-1.5 rounded-lg text-brand-primary hover:bg-brand-primary/5 transition-all">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={handleDelete} disabled={isPending} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setExpanded(e => !e)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all ml-1">
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Expanded Editor */}
            {expanded && (
                <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Question Text</label>
                            <input value={editData.title} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent font-bold text-brand-primary" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Key (internal ID)</label>
                            <input value={editData.key} onChange={e => setEditData(d => ({ ...d, key: e.target.value }))}
                                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent font-mono" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Description (optional)</label>
                        <input value={editData.description ?? ''} onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Category</label>
                            <select value={editData.category} onChange={e => setEditData(d => ({ ...d, category: e.target.value }))}
                                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent font-bold text-brand-primary">
                                <option value="PROSPECT">Student Registration</option>
                                <option value="UNIVERSITY">University Registration</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Input Type</label>
                            <select value={editData.type} onChange={e => setEditData(d => ({ ...d, type: e.target.value as 'select' | 'searchable-select' | 'text' | 'grid' }))}
                                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent font-bold text-brand-primary">
                                <option value="select">Dropdown</option>
                                <option value="searchable-select">Searchable Dropdown</option>
                                <option value="text">Free Text</option>
                                <option value="grid">Grid (Cards)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Placeholder Text</label>
                        <input value={editData.placeholder ?? ''} onChange={e => setEditData(d => ({ ...d, placeholder: e.target.value }))}
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                    </div>
                    {editData.type !== 'text' && (
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Options</label>
                            <OptionEditor options={editData.options ?? []} onChange={opts => setEditData(d => ({ ...d, options: opts }))} />
                        </div>
                    )}
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-50">
                        <button onClick={() => setEditing(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={isPending}
                            className="px-5 py-2.5 rounded-xl text-sm font-black bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-brand-accent" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function QuestionnaireManager({ initialQuestions }: { initialQuestions: DBQuestion[] }) {
    const [questions, setQuestions] = useState<DBQuestion[]>(initialQuestions);
    const [activeTab, setActiveTab] = useState<'PROSPECT' | 'UNIVERSITY'>('PROSPECT');
    const [showAdd, setShowAdd] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [newQ, setNewQ] = useState<QuestionnaireQuestionData>({ key: '', title: '', type: 'select', category: 'PROSPECT', options: [], active: true });

    const filteredQuestions = questions.filter(q => q.category === activeTab);

    const handleRefresh = (action: 'delete' | 'toggle' | 'move', id: string, extra?: unknown) => {
        if (action === 'delete') {
            setQuestions(prev => prev.filter(q => q.id !== id));
        } else if (action === 'toggle') {
            setQuestions(prev => prev.map(q => q.id === id ? { ...q, active: extra as boolean } : q));
        } else {
            window.location.reload();
        }
    };

    const handleAddSave = () => startTransition(async () => {
        if (!newQ.title.trim() || !newQ.key.trim()) { toast.error('Title and key are required'); return; }
        const result = await upsertQuestion({ ...newQ, category: activeTab });
        if (result?.success) {
            toast.success('Question added!');
            setShowAdd(false);
            setNewQ({ key: '', title: '', type: 'select', category: activeTab, options: [], active: true });
            window.location.reload();
        } else {
            toast.error(result?.error || 'Failed to add');
        }
    });

    return (
        <div className="space-y-6">
            {/* Category Tabs */}
            <div className="flex p-1.5 bg-gray-100/50 rounded-2xl w-full sm:w-80">
                {(['PROSPECT', 'UNIVERSITY'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setShowAdd(false); }}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                            ? 'bg-brand-primary text-white shadow-lg'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {categoryLabels[tab]}
                    </button>
                ))}
            </div>

            {/* Add Button */}
            {!showAdd ? (
                <button onClick={() => setShowAdd(true)}
                    className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-brand-accent hover:bg-brand-accent/5 transition-all flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-accent group">
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Add {categoryLabels[activeTab]} Question
                </button>
            ) : (
                <div className="bg-white rounded-2xl border border-brand-accent/30 shadow-xl p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-brand-primary text-sm uppercase tracking-widest">New {categoryLabels[activeTab]} Question</h3>
                        <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Question Text *</label>
                            <input value={newQ.title} onChange={e => setNewQ(d => ({ ...d, title: e.target.value }))} placeholder="e.g. Where do you plan to study?"
                                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent font-bold text-brand-primary" autoFocus />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Key *</label>
                            <input value={newQ.key} onChange={e => setNewQ(d => ({ ...d, key: e.target.value.toLowerCase().replace(/\s+/g, '_') }))} placeholder="e.g. study_destination"
                                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent font-mono" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Description (optional)</label>
                        <input value={newQ.description ?? ''} onChange={e => setNewQ(d => ({ ...d, description: e.target.value }))} placeholder="Shown below the question title"
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Type</label>
                            <select value={newQ.type} onChange={e => setNewQ(d => ({ ...d, type: e.target.value as 'select' | 'searchable-select' | 'text' | 'grid' }))}
                                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent font-bold text-brand-primary">
                                <option value="select">Dropdown</option>
                                <option value="searchable-select">Searchable Dropdown</option>
                                <option value="text">Free Text</option>
                                <option value="grid">Grid (Cards)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Placeholder</label>
                            <input value={newQ.placeholder ?? ''} onChange={e => setNewQ(d => ({ ...d, placeholder: e.target.value }))} placeholder="Select..."
                                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent" />
                        </div>
                    </div>
                    {newQ.type !== 'text' && (
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Options</label>
                            <OptionEditor options={newQ.options ?? []} onChange={opts => setNewQ(d => ({ ...d, options: opts }))} />
                        </div>
                    )}
                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-50">
                        <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
                        <button onClick={handleAddSave} disabled={isPending}
                            className="px-5 py-2.5 rounded-xl text-sm font-black bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 text-brand-accent" />}
                            Add Question
                        </button>
                    </div>
                </div>
            )}

            {/* Question List */}
            <div className="space-y-3">
                {filteredQuestions.length === 0 ? (
                    <div className="py-20 text-center opacity-50">
                        <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="font-black text-gray-400 text-sm uppercase tracking-widest">No {categoryLabels[activeTab].toLowerCase()} questions yet</p>
                    </div>
                ) : (
                    filteredQuestions.map((q, i) => (
                        <QuestionCard key={q.id} question={q} isFirst={i === 0} isLast={i === filteredQuestions.length - 1} onRefresh={handleRefresh} />
                    ))
                )}
            </div>
        </div>
    );
}
