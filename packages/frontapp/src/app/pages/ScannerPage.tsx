import { useState } from 'react';
import Button from '../components/Button';
import Scanner from '../components/Scanner';

const ScannerPage = () => {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const handleButtonClick = () => {
    setIsScannerActive(true);
  };

  return (
    <div>
      <Button value="Start scanner" onClick={handleButtonClick} />
      <Scanner
        active={isScannerActive}
        onDetected={(code) => {
          setIsScannerActive(false);
          console.log(code);
        }}
      />
    </div>
  );
};

export default ScannerPage;
