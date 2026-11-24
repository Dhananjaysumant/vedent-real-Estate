import { Reveal } from '../ui/Reveal';

const experiences = [
  {
    number: '01',
    title: 'Exceptional Architecture',
    body: 'Original residences designed by our atelier, with proportion, material and setting resolved as one.',
  },
  {
    number: '02',
    title: 'Thoughtful Interiors',
    body: 'Interiors planned around the way you live, with natural finishes, integrated storage and considered light.',
  },
  {
    number: '03',
    title: 'Extraordinary Locations',
    body: 'Coastal, alpine and harbour settings chosen for privacy, outlook and a sense of arrival.',
  },
  {
    number: '04',
    title: 'A Personalised Experience',
    body: 'One specialist guides you from first enquiry to private viewing, with discretion at every stage.',
  },
];

export function ExperienceValues() {
  return (
    <section className="values" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <div className="section-head">
          <Reveal>
            <span className="section-index">
              <span>05</span>
              <span>The experience</span>
            </span>
            <h2 id="experience-title">Considered at every scale</h2>
          </Reveal>
          <Reveal className="section-head__aside" delay={100}>
            <p>
              From the first site visit to the final material sample, every decision is made in service
              of a single idea: a home that feels inevitable.
            </p>
          </Reveal>
        </div>

        <div className="values__grid">
          {experiences.map((item, index) => (
            <Reveal key={item.number} className="value" delay={index * 70}>
              <span className="value__num">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
