import { produce } from 'immer';
import { assign, createActor, fromPromise, setup } from 'xstate';
import { getAnalysisPedia, getPartPedia, getResponsePedia } from '../service';

function handlePopoverContent(contentList: string[], papers: any[]) {
  const formattedContentList: {
    text: string;
    id?: string;
    type: 'text' | 'popover';
  }[][] = [];
  contentList.forEach((content: string) => {
    const pattern = /(\[.*?\])/g;
    const matches = content.match(pattern) || [];
    const splitText = content.split(pattern);
    const list = splitText.reduce<
      { text: string; id?: string; type: 'text' | 'popover' }[]
    >((arr, element) => {
      // @ts-ignore
      if (matches.includes(element)) {
        const id = element.replace(/^\[(.+)\]$/, '$1');
        const paper = papers.find((item) => item.id === id);
        const authors = paper?.authors[0] || '';
        const year = paper?.year || '';

        return [
          ...arr,
          {
            text: `（${authors}，${year}）`,
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

    formattedContentList.push(list);
  });
  return formattedContentList;
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

  const formattedBulletPoints = handlePopoverContent(data.bltpts, [...papers]);

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

const fetchResponsePedia = async ({
  input,
}: {
  input: {
    showPapers: any[];
  };
}) => {
  const { showPapers } = input;
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
    papers: fetchList,
  });
  if (!res.ok) {
    throw new Error('Failed get response');
  }

  const { papers } = await res.json();
  return papers;
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
    bulletPoints: {
      type: 'text' | 'popover';
      text: string;
      key: number;
      id?: string;
      isVisible: boolean;
    }[][];
    bulletPointsPrefix: string;
  };
  summaryZHInfo: {
    summary: string;
    bulletPoints: {
      type: 'text' | 'popover';
      text: string;
      key: number;
      id?: string;
      isVisible: boolean;
    }[][];
    bulletPointsPrefix: string;
  };
  summarySelectedInfo: {
    bulletPoints: {
      type: 'text' | 'popover';
      text: string;
      key: number;
      id?: string;
      isVisible: boolean;
    }[][];
  };
  showPapers: any[];
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
      | { type: 'INIT_FETCH' }
      | { type: 'FETCH_PAPERS' }
      | { type: 'FETCH_SUMMARY_ZH' }
      | { type: 'FETCH_SUMMARY' }
      | { type: 'CHANGE_MODE.EN' }
      | { type: 'CHANGE_MODE.SELECTED' }
      | { type: 'CHANGE_MODE.ZH_CN' }
      | { type: 'FETCH_RESPONSE' };
  },
  actors: {
    fetchSummary: fromPromise(fetchAnalysisPedia),
    fetchPapers: fromPromise(fetchPartPedia),
    fetchResponsePedia: fromPromise(fetchResponsePedia),
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
          initial: 'fetching',
          states: {
            idle: {
              on: {
                FETCH_PAPERS: {
                  target: 'fetching',
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
            fetching: {
              invoke: {
                src: 'fetchPapers',
                input: ({ context }) => ({
                  question: context.question,
                  mode: context.mode,
                }),
                onDone: [
                  {
                    target: [
                      'idle',
                      '#search.viewing.fetchingSummary.fetching',
                      '#search.viewing.fetchingResponse.fetching',
                    ],
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
          },
        },
        fetchingSummary: {
          initial: 'idle',
          states: {
            idle: {
              on: {
                FETCH_SUMMARY: {
                  target: 'fetching',
                },
              },
            },
            fetching: {
              invoke: {
                src: 'fetchSummary',
                input: ({ context }) => ({
                  mode: context.mode,
                  paperInfo: context.paperInfo,
                  paperZHInfo: context.paperZHInfo,
                }),
                onDone: {
                  target: 'idle',
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
                onError: 'idle',
              },
            },
          },
        },
        fetchingResponse: {
          initial: 'idle',
          states: {
            idle: {
              on: {
                FETCH_RESPONSE: {
                  target: 'fetching',
                },
              },
            },
            fetching: {
              invoke: {
                src: 'fetchResponsePedia',
                input: ({ context }) => ({
                  showPapers: context.showPapers,
                }),
                onDone: {
                  target: 'idle',
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
                          item.response = processedMap.get(item.id).response;
                        }
                      });
                    });
                  }),
                },
                onError: 'idle',
              },
            },
          },
        },
      },
    },
  },
  on: {
    SET_QUESTION: {
      actions: assign({
        question: ({ event }) => event.value,
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
            if (item.key === key) {
              item.isVisible = isVisible;
            }
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
              item.response = processedMap.get(item.id).response;
            }
          });
        });
      }),
    },
  },
  // states: {
  //   idle: {
  //     on: {
  //       FETCH_PAPERS: {
  //         target: 'initFetchingPapers',
  //       },
  //     },
  //   },
  //   initFetchingPapers: {
  //     invoke: {
  //       src: 'fetchPapers',
  //       input: ({ context }) => ({
  //         question: context.question,
  //         mode: context.mode,
  //       }),
  //       onDone: {
  //         target: 'fetchingSummary',
  //         actions: assign({
  //           paperInfo: ({ event }) => event.output,
  //           showPapers: ({ event, context }) => {
  //             return calcShowPapers(
  //               context.mode,
  //               context.sortMode,
  //               event.output.papers,
  //               context.pageIndex
  //             );
  //           },
  //         }),
  //       },
  //       onError: 'idle',
  //     },
  //   },
  //   fetchingSummary: {
  //     invoke: {
  //       src: 'fetchSummary',
  //       input: ({ context }) => ({
  //         mode: context.mode,
  //         paperInfo: context.paperInfo,
  //       }),
  //       onDone: {
  //         target: 'fetchingResponse',
  //         actions: assign({
  //           summaryInfo: ({ event, context }) =>
  //             produce(context.summaryInfo, (draft) => {
  //               draft.summary = event.output.summary;
  //               draft.bulletPoints = event.output.bulletPoints;
  //               draft.bulletPointsPrefix = event.output.bulletPointsPrefix;
  //             }),
  //         }),
  //       },
  //       onError: 'idle',
  //     },
  //   },
  //   fetchingResponse: {
  //     invoke: {
  //       src: 'fetchResponsePedia',
  //       input: ({ context }) => ({
  //         showPapers: context.showPapers,
  //       }),
  //       onDone: {
  //         target: 'idle',
  //         actions: assign({
  //           paperInfo: ({ event, context }) =>
  //             produce(context.paperInfo, (draft) => {
  //               const processedPapers = event.output;
  //               const processedMap = new Map(
  //                 processedPapers.map((item) => [item.id, item])
  //               );
  //               // if (mode === 'zh-cn') {
  //               //   const newPapers = papersZH.map((item) => {
  //               //     if (processedMap.has(item.id)) {
  //               //       return { ...item, response: processedMap.get(item.id).response };
  //               //     }
  //               //     return item;
  //               //   });
  //               //   return;
  //               // }

  //               draft.papers.forEach((item) => {
  //                 if (processedMap.has(item.id)) {
  //                   item.response = processedMap.get(item.id).response;
  //                 }
  //               });
  //             }),
  //           showPapers: ({ event, context }) =>
  //             produce(context.showPapers, (draft) => {
  //               const processedPapers = event.output;
  //               const processedMap = new Map(
  //                 processedPapers.map((item) => [item.id, item])
  //               );
  //               draft.forEach((item) => {
  //                 if (processedMap.has(item.id)) {
  //                   item.response = processedMap.get(item.id).response;
  //                 }
  //               });
  //             }),
  //         }),
  //       },
  //       onError: 'idle',
  //     },
  //   },
  // },
  // on: {
  // 'CHANGE_MODE.ZH_CN': {
  //   target: 'fetchingZHPapers',
  //   actions: assign({
  //     mode: () => SearchMode.EN,
  //   }),
  // },
  // CHANGE_MODE: {
  //   target: 'fetchingPapers',
  //   actions: assign({
  //     mode: ({ event }) => event.value,
  //   }),
  // },
});
// states: {
//   summaryZH: {
//     initial: 'idle',
//     states: {
//       idle: {
//         on: {
//           FETCH_SUMMARY_ZH: {
//             target: 'fetching',
//           },
//         },
//       },
//       fetching: {
//         invoke: {
//           src: 'fetchSummary',
//           input: ({ context }) => ({ name: context.summaryZH }),
//           onDone: {
//             target: 'idle',
//             actions: assign({
//               summaryZH: ({ event }) => event.output,
//             }),
//           },
//           onError: 'idle',
//         },
//       },
//     },
//   },
//   summary: {
//     initial: 'idle',
//     states: {
//       idle: {
//         on: {
//           FETCH_SUMMARY: {
//             target: 'fetching',
//           },
//         },
//       },
//       fetching: {
//         invoke: {
//           src: 'fetchSummary',
//           input: ({ context }) => ({ name: context.summary }),
//           onDone: {
//             target: 'idle',
//             actions: assign({
//               summary: ({ event }) => event.output,
//             }),
//           },
//           onError: 'idle',
//         },
//       },
//     },
//   },
//   papers: {
//     initial: 'idle',
//     states: {
//       idle: {
//         on: {
//           FETCH_PAPERS: {
//             target: 'fetching',
//           },
//         },
//       },
//       fetching: {
//         invoke: {
//           src: 'fetchPapers',
//           input: ({ context }) => ({ name: context.papers }),
//           onDone: {
//             target: 'idle',
//             actions: assign({
//               papers: ({ event }) => event.output,
//             }),
//           },
//           onError: 'idle',
//         },
//       },
//     },
//   },
// },
// on: {
// CHANGE_MODE: {
//   actions: assign({
//     mode: ({ event }) => event.value,
//   }),
// },
// CHANGE_INITIALED: {
//   actions: assign({
//     isInitialed: true,
//   }),
// },
// CHANGE_PAGE_INDEX: {
//   actions: assign({
//     pageIndex: ({ event }) => event.value,
//   }),
// },
// CHANGE_SUMMARY: {
//   actions: assign({
//     summary: true,
//   }),
// }
// },

export const searchActor = createActor(searchMachine);
searchActor.start();

export default searchMachine;
