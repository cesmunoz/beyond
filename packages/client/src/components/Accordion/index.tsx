import AccordionSection from './AccordionSection';

export type AccordionItem = {
  id: number;
  title: string;
  isOpen: boolean;
  content: React.ReactNode;
};

export type AccordionProps = {
  items: Array<AccordionItem>;
};

const Accordion = ({ items }: AccordionProps): JSX.Element => {
  return (
    <div className="accordion_section">
      {items.map(item => (
        <div key={`accordion_item_${item.id}`}>
          <AccordionSection isOpen={item.isOpen} title={item.title} index={item.id}>
            {item.content}
          </AccordionSection>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
