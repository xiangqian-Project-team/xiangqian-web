import { assign, createActor, createMachine } from 'xstate';

export enum SearchMode {
  EN = 'en',
  ZH_CN = 'zh-cn',
  SELECTED = 'selected',
}

interface SearchContext {
  mode: SearchMode;
  pageIndex: number;
  isSideBarOpen: boolean;
  isLoadingList: boolean;
  isLoadingSummary: boolean;
}

type SearchEvent = {
  value: SearchMode;
  type: 'CHANGE_MODE';
};

type PageIndexEvent = {
  type: 'CHANGE_PAGE_INDEX';
  value: number;
};

type ChangeSideBarEvent = {
  type: 'CHANGE_SIDEBAR';
  value: boolean;
};

const searchMachine = createMachine({
  id: 'search',
  types: {} as {
    context: SearchContext;
    events: SearchEvent | PageIndexEvent | ChangeSideBarEvent;
  },
  context: {
    mode: SearchMode.EN,
    pageIndex: 1,
    isSideBarOpen: false,
    isLoadingList: false,
    isLoadingSummary: false,
  },
  on: {
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
    CHANGE_SIDEBAR: {
      actions: assign({
        isSideBarOpen: ({ event }) => event.value,
      }),
    },
  },
});

export const searchActor = createActor(searchMachine);
searchActor.start();

export default searchMachine;
