import { produce } from 'immer';
import { assign, createActor, fromPromise, setup } from 'xstate';
import {
  getAnalysisPedia,
  getLiteratureReview,
  getPartPedia,
  getRelatedSearch,
  getResponsePedia,
} from '../service';

interface IPopoverItem {
  text: string;
  id?: string;
  type: 'text' | 'popover';
  key: number;
  isVisible: boolean;
}

export interface IPopoverInfo {
  expensionPopoverList: IPopoverItem[];
  key: number;
  popoverList: IPopoverItem[];
}

const initPopoverContent = (contentList: string[], papers: any[]) => {
  const formattedContentList: IPopoverInfo[] = [];
  contentList.forEach((content: string) => {
    const info = {
      key: Math.random(),
      popoverList: [],
      expensionPopoverList: [],
    };
    info.popoverList = handlePopoverContent(content, papers);
    formattedContentList.push(info);
  });
  return formattedContentList;
};

function handlePopoverContent(content: string, papers: any[]) {
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

function calcShowPapers(data: {
  mode: string;
  sortMode: string;
  papers: any[];
  papersZH: any[];
  pageIndex: number;
  pageSize: number;
}) {
  const { mode, sortMode, papers, pageIndex, papersZH, pageSize } = data;
  let newList = [];
  switch (mode) {
    case 'en':
      newList = [...papers];
      break;
    case 'zh-cn':
      newList = [...papersZH];
      break;
    case 'selected':
      newList = [...papers, ...papersZH].filter((item) => item.selected);
      break;
  }

  switch (sortMode) {
    case 'time':
      return newList
        .sort((a, b) => b.year - a.year)
        .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    case 'relevance':
      return newList
        .sort((a, b) => b.relevance - a.relevance)
        .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    case 'quote':
      return newList
        .sort((a, b) => b.citationCount - a.citationCount)
        .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
  }
  return newList.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
}

const fetchPartPedia = async ({
  input,
}: {
  input: { question: string; mode: string };
}) => {
  const listRes = await getPartPedia({ query: input.question }, input.mode);
  if (!listRes.ok) {
    throw new Error('Failed search');
  }
  const data = await listRes.json();
  return {
    queryEn: data.queryEn,
    queryZh: data.queryZh,
    papers: data.papers.map((item) => {
      item.selected = false;
      return item;
    }),
  };
  // return {
  //   queryEn: '',
  //   queryZh: '',
  //   papers: ['test'],
  // };
};

const fetchAnalysisPedia = async ({
  input,
}: {
  input: {
    mode: string;
    paperInfo: {
      papers: any[];
      queryEn: string;
      queryZh: string;
    };
    paperZHInfo: {
      papers: any[];
      queryEn: string;
      queryZh: string;
    };
  };
}) => {
  let { queryEn, queryZh, papers } = input.paperInfo;
  if (input.mode === 'zh-cn') {
    queryEn = input.paperZHInfo.queryEn;
    queryZh = input.paperZHInfo.queryZh;
    papers = input.paperZHInfo.papers;
  }
  const res = await getAnalysisPedia({
    papers,
    queryEn,
    queryZh,
  });
  if (!res.ok) {
    throw new Error('Failed get summary');
  }
  const data = await res.json();

  const formattedBulletPoints = initPopoverContent(data.bltpts, [...papers]);

  return {
    summary: data.answer as string,
    bulletPoints: formattedBulletPoints,
    bulletPointsPrefix: data.bltptsPrefix,
  };

  // return {
  //   summary: 'data.answer',
  //   bulletPoints: ['data.bltpts'],
  //   bulletPointsPrefix: 'data.bltptsPrefix',
  // };
};

const fetchLiteratureReview = async ({
  input,
}: {
  input: { papers: any[]; queryEn: string; queryZh: string };
}) => {
  const { papers, queryEn, queryZh } = input;
  const res = await getLiteratureReview({
    papers,
    queryEn,
    queryZh,
  });
  if (!res.ok) {
    throw new Error('Failed get summary');
  }

  const data = (await res.json()) as { review: string };
  const formattedBulletPoints = initPopoverContent([data.review], [...papers]);
  return formattedBulletPoints;
};

const fetchResponsePedia = async ({
  input,
}: {
  input: {
    showPapers: any[];
    queryZh: string;
  };
}) => {
  const { showPapers, queryZh } = input;
  const fetchList = [];
  showPapers.forEach((element) => {
    if (element.response) {
      return;
    }
    fetchList.push(element);
  });
  if (fetchList.length === 0) {
    throw new Error('No need to fetch');
  }
  const res = await getResponsePedia({
    queryZh,
    papers: fetchList,
  });
  if (!res.ok) {
    throw new Error('Failed get response');
  }

  const { papers } = await res.json();
  return papers;
};

const fetchRelatedSearch = async ({
  input,
}: {
  input: {
    summary: string;
    queryZh: string;
  };
}) => {
  const { summary, queryZh } = input;
  try {
    const listRes = await getRelatedSearch({
      answer: summary,
      queryZh: queryZh,
    });
    if (!listRes.ok) {
      throw new Error('Failed search');
    }
    const data = (await listRes.json()) as string[];
    return data;
  } catch (e) {
    throw new Error('Failed search');
  }
};

export enum SearchMode {
  EN = 'en',
  ZH_CN = 'zh-cn',
  SELECTED = 'selected',
}

export enum SortMode {
  DEFAULT = 'default',
  RELEVANCE = 'relevance',
  TIME = 'time',
  LEVEL = 'level',
  QUOTE = 'quote',
}

interface SearchContext {
  mode: SearchMode;
  question: string;
  sortMode: SortMode;
  pageIndex: number;
  readonly pageSize: number;
  isLoadingSummary: boolean;
  isInitialed: boolean;
  summary: string;
  summaryZH: string;
  paperInfo: {
    papers: any[];
    queryEn: string;
    queryZh: string;
  };
  paperZHInfo: {
    papers: any[];
    queryEn: string;
    queryZh: string;
  };
  summaryInfo: {
    summary: string;
    bulletPoints: IPopoverInfo[];
    bulletPointsPrefix: string;
  };
  summaryZHInfo: {
    summary: string;
    bulletPoints: IPopoverInfo[];
    bulletPointsPrefix: string;
  };
  summarySelectedInfo: {
    bulletPoints: IPopoverInfo[];
  };
  showPapers: any[];
  faqList: string[];
}

type ChangeSortModeEvent = {
  value: SortMode;
  type: 'CHANGE_SORT_MODE';
};

type PageIndexEvent = {
  type: 'CHANGE_PAGE_INDEX';
  value: number;
};

type ChangeInitialedEvent = {
  type: 'CHANGE_INITIALED';
};

type ChangeSummaryEvent = {
  type: 'CHANGE_SUMMARY';
};

type SetQuestionEvent = {
  type: 'SET_QUESTION';
  value: string;
};

const searchMachine = setup({
  types: {} as {
    context: SearchContext;
    events:
      | PageIndexEvent
      | ChangeInitialedEvent
      | ChangeSortModeEvent
      | ChangeSummaryEvent
      | SetQuestionEvent
      | { type: 'SET_RESPONSE_PEDIA'; value: any }
      | {
          type: 'TOGGLE_POPOVER_VISIBLE';
          value: { key: number; isVisible: boolean };
        }
      | { type: 'SET_EXPENSION_TEXT'; value: { text: string; key: number } }
      | { type: 'RESET' }
      | { type: 'RESET_FETCH_RELATED' }
      | { type: 'FETCH_RELATED_SEARCH' }
      | { type: 'INIT_FETCH' }
      | { type: 'FETCH_PAPERS' }
      | { type: 'FETCH_SUMMARY_ZH' }
      | { type: 'FETCH_SUMMARY' }
      | { type: 'CHANGE_MODE.EN' }
      | { type: 'CHANGE_MODE.SELECTED' }
      | { type: 'CHANGE_MODE.ZH_CN' }
      | { type: 'FETCH_RESPONSE' }
      | { type: 'FETCH_LITERATURE_REVIEW' }
      | { type: 'UPDATE_RESPONSE'; value: any };
  },
  actors: {
    fetchLiteratureReview: fromPromise(fetchLiteratureReview),
    fetchSummary: fromPromise(fetchAnalysisPedia),
    fetchPapers: fromPromise(fetchPartPedia),
    fetchResponsePedia: fromPromise(fetchResponsePedia),
    fetchRelatedSearch: fromPromise(fetchRelatedSearch),
  },
}).createMachine({
  id: 'search',
  context: {
    mode: SearchMode.EN,
    question: '',
    sortMode: SortMode.DEFAULT,
    pageIndex: 1,
    pageSize: 10,
    isLoadingSummary: false,
    isInitialed: false,
    summary: '',
    summaryZH: '',
    paperInfo: {
      papers: [],
      queryEn: '',
      queryZh: '',
    },
    paperZHInfo: {
      papers: [],
      queryEn: '',
      queryZh: '',
    },
    summaryInfo: {
      summary: '',
      bulletPoints: [],
      bulletPointsPrefix: '',
    },
    summaryZHInfo: {
      summary: '',
      bulletPoints: [],
      bulletPointsPrefix: '',
    },
    summarySelectedInfo: {
      bulletPoints: [],
    },
    showPapers: [],
    faqList: [],
  },
  initial: 'init',
  states: {
    init: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            INIT_FETCH: {
              target: ['#search.viewing'],
              actions: assign({
                paperInfo: () => ({
                  papers: [],
                  queryEn: '',
                  queryZh: '',
                }),
                paperZHInfo: () => ({
                  papers: [],
                  queryEn: '',
                  queryZh: '',
                }),
                summaryInfo: () => ({
                  summary: '',
                  bulletPoints: [],
                  bulletPointsPrefix: '',
                }),
                summaryZHInfo: () => ({
                  summary: '',
                  bulletPoints: [],
                  bulletPointsPrefix: '',
                }),
                showPapers: () => [],
              }),
            },
          },
        },
      },
    },
    viewing: {
      type: 'parallel',
      states: {
        fetchingPapers: {
          initial: 'idle',
          states: {
            idle: {},
            fetching: {
              invoke: {
                src: 'fetchPapers',
                input: ({ context }) => ({
                  question: context.question,
                  mode: context.mode,
                }),
                onDone: [
                  {
                    target: 'success',
                    actions: assign(({ context, event }) => {
                      return produce(context, (draft) => {
                        switch (context.mode) {
                          case 'zh-cn':
                            draft.paperZHInfo = event.output;
                            draft.showPapers = calcShowPapers({
                              mode: context.mode,
                              sortMode: context.sortMode,
                              papers: context.paperInfo.papers,
                              papersZH: event.output.papers,
                              pageIndex: context.pageIndex,
                              pageSize: context.pageSize,
                            });
                            break;
                          case 'en':
                            draft.paperInfo = event.output;
                            draft.showPapers = calcShowPapers({
                              mode: context.mode,
                              sortMode: context.sortMode,
                              papers: event.output.papers,
                              papersZH: context.paperZHInfo.papers,
                              pageIndex: context.pageIndex,
                              pageSize: context.pageSize,
                            });
                            break;
                        }
                      });
                    }),
                  },
                ],
                onError: 'idle',
              },
            },
            success: {},
            fail: {},
          },
          on: {
            RESET_FETCH_PAPERS: {
              target: '.idle',
            },
            FETCH_PAPERS: {
              target: '.fetching',
              guard: ({ context }) => {
                if (!context.question) {
                  return false;
                }
                if (
                  context.mode === 'en' &&
                  context.paperInfo.papers.length > 0
                ) {
                  return false;
                }
                if (
                  context.mode === 'zh-cn' &&
                  context.paperZHInfo.papers.length > 0
                ) {
                  return false;
                }
                return true;
              },
            },
          },
        },
        fetchingSummary: {
          initial: 'idle',
          states: {
            idle: {},
            fetching: {
              invoke: {
                src: 'fetchSummary',
                input: ({ context }) => ({
                  mode: context.mode,
                  paperInfo: context.paperInfo,
                  paperZHInfo: context.paperZHInfo,
                }),
                onDone: {
                  target: 'success',
                  actions: assign(({ context, event }) => {
                    return produce(context, (draft) => {
                      switch (context.mode) {
                        case 'zh-cn':
                          draft.summaryZHInfo.summary = event.output.summary;
                          draft.summaryZHInfo.bulletPoints =
                            event.output.bulletPoints;
                          draft.summaryZHInfo.bulletPointsPrefix =
                            event.output.bulletPointsPrefix;
                          break;
                        case 'en':
                          draft.summaryInfo.summary = event.output.summary;
                          draft.summaryInfo.bulletPoints =
                            event.output.bulletPoints;
                          draft.summaryInfo.bulletPointsPrefix =
                            event.output.bulletPointsPrefix;
                          break;
                      }
                    });
                  }),
                },
                onError: 'fail',
              },
            },
            success: {},
            fail: {},
          },
          on: {
            RESET_FETCH_SUMMARY: {
              target: '.idle',
            },
            FETCH_SUMMARY: {
              target: '.fetching',
            },
          },
        },
        fetchingLiteratureReview: {
          initial: 'idle',
          states: {
            idle: {},
            fetching: {
              invoke: {
                src: 'fetchLiteratureReview',
                input: ({ context }) => ({
                  papers: [
                    ...context.paperInfo.papers,
                    ...context.paperZHInfo.papers,
                  ].filter((item) => item.selected),
                  queryEn:
                    context.paperInfo.queryEn || context.paperZHInfo.queryEn,
                  queryZh:
                    context.paperInfo.queryZh || context.paperZHInfo.queryZh,
                }),
                onDone: {
                  target: 'success',
                  actions: assign(({ context, event }) => {
                    return produce(context, (draft) => {
                      draft.summarySelectedInfo.bulletPoints = event.output;
                    });
                  }),
                },
                onError: 'fail',
              },
            },
            success: {},
            fail: {},
          },
          on: {
            RESET_FETCH_LITERATURE_REVIEW: {
              target: '.idle',
            },
            FETCH_LITERATURE_REVIEW: {
              target: '.fetching',
            },
          },
        },
        fetchingResponse: {
          initial: 'idle',
          states: {
            idle: {},
            fetching: {
              invoke: {
                src: 'fetchResponsePedia',
                input: ({ context }) => ({
                  showPapers: context.showPapers,
                  queryZh:
                    context.paperInfo.queryZh || context.paperZHInfo.queryZh,
                }),
                onDone: {
                  target: 'success',
                  actions: assign(({ context, event }) => {
                    return produce(context, (draft) => {
                      const processedPapers = event.output;
                      const processedMap = new Map(
                        processedPapers.map((item) => [item.id, item])
                      );
                      [
                        ...draft.paperInfo.papers,
                        ...draft.paperZHInfo.papers,
                        ...draft.showPapers,
                      ].forEach((item) => {
                        if (processedMap.has(item.id)) {
                          // @ts-ignore
                          item.response = processedMap.get(item.id).response;
                        }
                      });
                    });
                  }),
                },
                onError: 'fail',
              },
            },
            success: {},
            fail: {},
          },
          on: {
            FETCH_RESPONSE: {
              target: '.fetching',
            },
          },
        },
        fetchingRelatedSearch: {
          initial: 'idle',
          states: {
            idle: {
              on: {},
            },
            fetching: {
              invoke: {
                src: 'fetchRelatedSearch',
                input: ({ context }) => ({
                  summary:
                    context.summaryInfo.summary ||
                    context.summaryZHInfo.summary,
                  queryZh:
                    context.paperInfo.queryZh || context.paperZHInfo.queryZh,
                }),
                onDone: {
                  target: 'success',
                  actions: assign(({ context, event }) => {
                    return produce(context, (draft) => {
                      draft.faqList = event.output;
                    });
                  }),
                },
                onError: 'fail',
              },
            },
            success: {},
            fail: {},
          },
          on: {
            RESET_FETCH_RELATED: {
              target: '.idle',
            },
            FETCH_RELATED_SEARCH: {
              target: '.fetching',
            },
          },
        },
      },
    },
  },
  on: {
    RESET: {
      target: '.init',
    },
    SET_QUESTION: {
      actions: assign({
        question: ({ event }) => event.value,
      }),
    },
    UPDATE_RESPONSE: {
      actions: assign({
        paperInfo: ({ event, context }) => {
          return {
            ...context.paperInfo,
            papers: context.paperInfo.papers.map((item) => {
              if (item.id === event.value.id) {
                return event.value;
              }
              return item;
            }),
          };
        },
        paperZHInfo: ({ event, context }) => {
          return {
            ...context.paperZHInfo,
            papers: context.paperZHInfo.papers.map((item) => {
              if (item.id === event.value.id) {
                return event.value;
              }
              return item;
            }),
          };
        },
        showPapers: ({ event, context }) => {
          const id = event.value.id;
          const newPaper = event.value;
          const papers = context.paperInfo.papers.map((item) => {
            if (id === item.id) {
              item = newPaper;
            }
            return item;
          });
          const papersZH = context.paperZHInfo.papers.map((item) => {
            if (id === item.id) {
              item = newPaper;
            }
            return item;
          });
          return calcShowPapers({
            mode: context.mode,
            sortMode: context.sortMode,
            papers: papers,
            papersZH: papersZH,
            pageIndex: context.pageIndex,
            pageSize: context.pageSize,
          });
        },
      }),
    },
    CHANGE_SORT_MODE: {
      actions: assign({
        sortMode: ({ event }) => event.value,
        showPapers: ({ event, context }) => {
          return calcShowPapers({
            mode: context.mode,
            sortMode: event.value,
            papers: context.paperInfo.papers,
            papersZH: context.paperZHInfo.papers,
            pageIndex: context.pageIndex,
            pageSize: context.pageSize,
          });
        },
      }),
    },
    'CHANGE_MODE.EN': {
      actions: assign({
        mode: () => SearchMode.EN,
        showPapers: ({ context }) => {
          return calcShowPapers({
            mode: SearchMode.EN,
            sortMode: context.sortMode,
            papers: context.paperInfo.papers,
            papersZH: context.paperZHInfo.papers,
            pageIndex: context.pageIndex,
            pageSize: context.pageSize,
          });
        },
      }),
    },
    'CHANGE_MODE.ZH_CN': {
      actions: assign({
        mode: () => SearchMode.ZH_CN,
        showPapers: ({ context }) => {
          return calcShowPapers({
            mode: SearchMode.ZH_CN,
            sortMode: context.sortMode,
            papers: context.paperInfo.papers,
            papersZH: context.paperZHInfo.papers,
            pageIndex: context.pageIndex,
            pageSize: context.pageSize,
          });
        },
      }),
    },
    'CHANGE_MODE.SELECTED': {
      actions: assign({
        mode: () => SearchMode.SELECTED,
        showPapers: ({ context }) => {
          return produce(context.showPapers, (draft) => {
            draft = calcShowPapers({
              mode: SearchMode.SELECTED,
              sortMode: context.sortMode,
              papers: context.paperInfo.papers,
              papersZH: context.paperZHInfo.papers,
              pageIndex: context.pageIndex,
              pageSize: context.pageSize,
            });
          });
        },
      }),
    },
    CHANGE_PAGE_INDEX: {
      actions: assign({
        pageIndex: ({ event }) => event.value,
        showPapers: ({ event, context }) => {
          return calcShowPapers({
            mode: context.mode,
            sortMode: context.sortMode,
            papers: context.paperInfo.papers,
            papersZH: context.paperZHInfo.papers,
            pageIndex: event.value,
            pageSize: context.pageSize,
          });
        },
      }),
    },
    TOGGLE_SELECT: {
      actions: assign(({ event, context }) => {
        return produce(context, (draft) => {
          const id = event.value;
          [
            ...draft.paperInfo.papers,
            ...draft.paperZHInfo.papers,
            ...draft.showPapers,
          ].forEach((item) => {
            if (item.id === id) {
              item.selected = !item.selected;
            }
          });
        });
      }),
    },
    TOGGLE_POPOVER_VISIBLE: {
      actions: assign(({ event, context }) => {
        return produce(context, (draft) => {
          const { key, isVisible } = event.value;
          [
            ...draft.summaryInfo.bulletPoints.flat(),
            ...draft.summaryZHInfo.bulletPoints.flat(),
            ...draft.summarySelectedInfo.bulletPoints.flat(),
          ].forEach((item) => {
            [...item.popoverList, ...item.expensionPopoverList].forEach(
              (element) => {
                if (element.key === key) {
                  element.isVisible = isVisible;
                }
              }
            );
          });
        });
      }),
    },
    SET_RESPONSE_PEDIA: {
      actions: assign(({ event, context }) => {
        return produce(context, (draft) => {
          const processedPapers = event.value;
          const processedMap = new Map(
            processedPapers.map((item) => [item.id, item])
          );
          [
            ...draft.paperInfo.papers,
            ...draft.paperZHInfo.papers,
            ...draft.showPapers,
          ].forEach((item) => {
            if (processedMap.has(item.id)) {
              // @ts-ignore
              item.response = processedMap.get(item.id).response;
            }
          });
        });
      }),
    },
    SET_EXPENSION_TEXT: {
      actions: assign(({ event, context }) => {
        return produce(context, (draft) => {
          const { text, key } = event.value;
          [
            ...draft.summaryInfo.bulletPoints.flat(),
            ...draft.summaryZHInfo.bulletPoints.flat(),
            ...draft.summarySelectedInfo.bulletPoints.flat(),
          ].forEach((item) => {
            if (item.key === key) {
              item.expensionPopoverList = handlePopoverContent(text, [
                ...draft.paperInfo.papers,
                ...draft.paperZHInfo.papers,
                ...draft.showPapers,
              ]);
            }
          });
        });
      }),
    },
  },
});

export const searchActor = createActor(searchMachine);
searchActor.start();

export default searchMachine;
