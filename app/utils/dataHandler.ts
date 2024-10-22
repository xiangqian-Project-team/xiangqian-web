export interface IPopoverItem {
  text: string;
  id?: string;
  type: 'text' | 'popover';
  key: number;
  isVisible: boolean;
}

export function handlePopoverContentExtension(content: string, papers: any[]) {
  const pattern = /(\[.*?\])/g;
  const matches = content.match(pattern) || [];
  const splitText = content.split(pattern);
  const list = splitText.reduce<IPopoverItem[]>((arr, element) => {
    // @ts-ignore
    if (matches.includes(element)) {
      const id = element.replace(/^\[(.+)\]$/, '$1');
      const paper = papers.find((item) => item.id === id);
      const authors = paper?.authors[0] || '';
      const year = paper?.year || '';

      return [
        ...arr,
        {
          text: `(${authors}, ${year}) `,
          id,
          key: Math.random(),
          type: 'popover',
          isVisible: false,
        },
      ];
    }
    return [
      ...arr,
      {
        text: element,
        key: Math.random(),
        type: 'text',
        isVisible: false,
      },
    ];
  }, []);

  return list;
}
