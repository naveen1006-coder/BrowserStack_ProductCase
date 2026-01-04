import { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DiffView } from '@/components/DiffView';
import { useSprint } from '@/context/SprintContext';
import { refineTicket } from '@/utils/refineTicket';
import { generateContext } from '@/utils/generateContext';
import { Check, AlertCircle, Sparkles, Rabbit } from 'lucide-react';

export function TicketModal({ ticket, onClose }) {
    const { saveRefinedTicket, refinedTickets } = useSprint();
    const [isAccepting, setIsAccepting] = useState(false);

    // Check if already refined
    const isAlreadyRefined = ticket ? !!refinedTickets[ticket.id] : false;

    // Generate refinement suggestions
    const refinement = useMemo(() => {
        if (!ticket) return null;
        const context = generateContext(ticket.id);
        return refineTicket(ticket, context);
    }, [ticket]);

    const handleAccept = async () => {
        if (!refinement) return;

        setIsAccepting(true);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Save to localStorage
        saveRefinedTicket(ticket.id, refinement);

        setIsAccepting(false);
        onClose();
    };

    if (!ticket) return null;

    return (
        <Dialog open={!!ticket} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto !bg-white !border-neutral-200 !text-neutral-900">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="!bg-neutral-100 !text-neutral-700">{ticket.id}</Badge>
                        {isAlreadyRefined && (
                            <Badge variant="success" className="flex items-center gap-1 !bg-success-50 !text-success-700">
                                <Check className="w-3 h-3" />
                                Already Refined
                            </Badge>
                        )}
                    </div>
                    <DialogTitle className="text-xl !text-neutral-900">{ticket.title}</DialogTitle>
                    <DialogDescription className="!text-neutral-500">
                        AI-suggested improvements for better clarity and completeness
                    </DialogDescription>
                </DialogHeader>

                {/* Confidence indicator */}
                {refinement && (
                    <div className="flex items-center gap-2 p-3 !bg-primary-50 rounded-lg">
                        <Rabbit className="w-5 h-5 !text-primary-500" />
                        <span className="text-sm font-medium !text-primary-700">
                            Overall Confidence: {Math.round(refinement.overallConfidence * 100)}%
                        </span>
                        {refinement.aiWarnings && refinement.aiWarnings.length > 0 && (
                            <Badge variant="warning" className="ml-auto !bg-warning-50 !text-warning-700">
                                {refinement.aiWarnings.length} low-confidence suggestion(s)
                            </Badge>
                        )}
                    </div>
                )}

                {/* AI Warnings */}
                {refinement?.aiWarnings && refinement.aiWarnings.length > 0 && (
                    <div className="p-3 !bg-warning-50 rounded-lg !border-warning-200 border">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 !text-warning-500 shrink-0" />
                            <div>
                                <p className="text-sm font-medium !text-warning-700">
                                    Review Recommended
                                </p>
                                <ul className="mt-1 text-sm !text-warning-600 list-disc list-inside">
                                    {refinement.aiWarnings.map((warning, idx) => (
                                        <li key={idx}>{warning.message}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Diff view */}
                <div className="mt-4">
                    <h3 className="text-sm font-semibold !text-neutral-700 mb-3">
                        Suggested Improvements
                    </h3>
                    <DiffView improvements={refinement?.improvements || []} />
                </div>

                <DialogFooter className="mt-6 gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAccept}
                        disabled={isAccepting || isAlreadyRefined}
                        aria-label="Accept AI improvements"
                    >
                        {isAccepting ? (
                            'Saving...'
                        ) : isAlreadyRefined ? (
                            <>
                                <Check className="w-4 h-4" />
                                Already Accepted
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Accept Improvements
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default TicketModal;
