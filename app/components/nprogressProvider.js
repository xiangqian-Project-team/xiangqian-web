'use client';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
const NprogressProvider = ({ children }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="2px"
        color="#00A650"
        options={{ showSpinner: false }}
      />
    </>
  );
};
export default NprogressProvider;
