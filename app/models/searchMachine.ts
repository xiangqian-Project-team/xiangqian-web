import { assign, createActor, fromPromise, setup } from 'xstate';

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
  sortMode: SortMode;
  pageIndex: number;
  isLoadingList: boolean;
  isLoadingSummary: boolean;
  isInitialed: boolean;
  summary: string;
  summaryZH: string;
  papers: any[];
}

type SearchEvent = {
  value: SearchMode;
  type: 'CHANGE_MODE';
};

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

const searchMachine = setup({
  types: {} as {
    context: SearchContext;
    events:
      | SearchEvent
      | PageIndexEvent
      | ChangeInitialedEvent
      | ChangeSortModeEvent
      | ChangeSummaryEvent
      | { type: 'FETCH_PAPERS' }
      | { type: 'FETCH_SUMMARY_ZH' }
      | { type: 'FETCH_SUMMARY' }
  },
  actors: {
    fetchSummary: fromPromise(async ({ input }: { input: { name: string } }) => {
      function test(): Promise<string> {
        return new Promise((resolve) => {
          setTimeout(() => resolve('test'), 1000);
        });
      }
      const data = await test();

      return data;
    }),
    fetchPapers: fromPromise(async ({ input }: { input: { name: string } }) => {
      function test(): Promise<string[]> {
        return new Promise((resolve) => {
          setTimeout(() => resolve(['test']), 1000);
        });
      }
      const data = await test();

      return data;
    }),
  },
}).createMachine({
  id: 'search',
  context: {
    mode: SearchMode.EN,
    sortMode: SortMode.DEFAULT,
    pageIndex: 1,
    isLoadingList: false,
    isLoadingSummary: false,
    isInitialed: false,
    summary: '',
    summaryZH: '',
    papers: [],
  },
  type: 'parallel',
  states: {
    summaryZH: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            FETCH_SUMMARY_ZH: {
              target: 'fetching',
            },
          },
        },
        fetching: {
          invoke: {
            src: 'fetchSummary',
            input: ({ context }) => ({ name: context.summaryZH }),
            onDone: {
              target: 'idle',
              actions: assign({
                summaryZH: ({ event }) => event.output,
              }),
            },
            onError: 'idle',
          },
        },
      },
    },
    summary: {
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
            input: ({ context }) => ({ name: context.summary }),
            onDone: {
              target: 'idle',
              actions: assign({
                summary: ({ event }) => event.output,
              }),
            },
            onError: 'idle',
          },
        },
      },
    },
    papers: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            FETCH_PAPERS: {
              target: 'fetching',
            },
          },
        },
        fetching: {
          invoke: {
            src: 'fetchPapers',
            input: ({ context }) => ({ name: context.papers }),
            onDone: {
              target: 'idle',
              actions: assign({
                papers: ({ event }) => event.output,
              }),
            },
            onError: 'idle',
          },
        },
      },
    }
  },
  on: {
    CHANGE_INITIALED: {
      actions: assign({
        isInitialed: true,
      }),
    },
    CHANGE_MODE: {
      actions: assign({
        mode: ({ event }) => event.value,
      }),
    },
    CHANGE_PAGE_INDEX: {
      actions: assign({
        pageIndex: ({ event }) => event.value,
      }),
    },
    CHANGE_SORT_MODE: {
      actions: assign({
        sortMode: ({ event }) => event.value,
      }),
    },
    // CHANGE_SUMMARY: {
    //   actions: assign({
    //     summary: true,
    //   }),
    // }
  },
});

export const searchActor = createActor(searchMachine);
searchActor.start();

export default searchMachine;
