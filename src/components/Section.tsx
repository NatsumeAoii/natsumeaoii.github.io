import type { ReactNode } from 'react';
import { SECTION_IDS } from '../constants';

interface SectionProps {
    id: string;
    title: string;
    children: ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
    const index = SECTION_IDS.indexOf(id) + 1;

    return (
        <section id={id} className="ledger-section">
            <div className="section-head">
                <span className="index">{String(index).padStart(2, '0')}</span>
                <h2>{title}</h2>
            </div>
            {children}
        </section>
    );
}
