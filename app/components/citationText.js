import Cite from 'citation-js';
import { useMemo } from 'react';

const CitationText = ({ bibtex, template }) => {
  const formattedCitation = useMemo(() => {
    try {
      const citation = new Cite(bibtex);

      const output = citation.format('bibliography', {
        format: 'html', // 修改为 'html' 以获取带有HTML标签的格式
        template: template,
      });

      return <div dangerouslySetInnerHTML={{ __html: output }} />;
    } catch (error) {
      console.error('Error formatting citation', error);
      return <p>Error formatting citation.</p>;
    }
  }, [bibtex, template]);

  return formattedCitation;
};

export default CitationText;
