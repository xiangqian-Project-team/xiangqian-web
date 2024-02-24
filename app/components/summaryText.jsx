'use client';
import { useAtomValue } from 'jotai';
import { summaryAtom } from '../models/search';
import styles from './summaryText.module.scss';

export default function SummaryText() {
  //   const papers = useAtomValue(papersAtom);
  const summary = useAtomValue(summaryAtom);
  //   const { papers, summary } = props;
  return <div className={styles.summaryText}>{summary}</div>;
}
