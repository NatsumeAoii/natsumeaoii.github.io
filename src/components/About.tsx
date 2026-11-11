import { useSettings } from '../context/settings';
import { Section } from './Section';

export function About() {
    const { t } = useSettings();
    const a = t.about;

    return (
        <Section id="about" title={a.title}>
            <div className="prose">
                <p className="lede">{a.summary}</p>
                <p className="side">{a.detail}</p>
            </div>

            <dl className="facts">
                <div>
                    <dt>{a.educationLabel}</dt>
                    <dd>{a.school}</dd>
                </div>
                <div>
                    <dt>{a.degreeLabel}</dt>
                    <dd>{a.degree}</dd>
                </div>
                <div>
                    <dt>{a.gpaLabel}</dt>
                    <dd>{a.gpa}</dd>
                </div>
                <div>
                    <dt>{a.periodLabel}</dt>
                    <dd>{a.period}</dd>
                </div>
            </dl>
        </Section>
    );
}
