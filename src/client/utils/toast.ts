import toast from 'react-hot-toast';

export const warnToast = (message: string) => {
  toast(message, {
    icon: '⚠️',
    style: {
      padding: '4px 8px',
      color: '#333',
      fontFamily: 'sans-serif',
      background: 'rgb(236 236 236)',
      borderRadius: '6px',
      fontWeight: 500,
      fontSize: '14px',
      border: '1px solid #e0e068'
    },
    duration: 4000,
  });
};

export const successToast = (message: string) => {
  toast(message, {
    icon: '✅',
    style: {
      padding: '4px 8px',
      color: '#333',
      border: '1px solid #32c413',
      fontFamily: 'sans-serif',
      background: 'rgb(236 236 236)',
      borderRadius: '6px',
      fontWeight: 500,
      fontSize: '14px'
    },
    duration: 4000,
  });
};

export const errorToast = (message: string) => {
  toast(message, {
    icon: '❌',
    style: {
      padding: '4px 8px',
      
      color: '#333',
      fontFamily: 'sans-serif',
      background: 'rgb(236 236 236)',
      borderRadius: '6px',
      fontWeight: 500,
      fontSize: '14px',
      border: '1px solid red'
    },
    duration: 4000,
  });
};

export const infoToast = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      border: '1px solid #2196f3',
      padding: '16px',
      color: '#333',
      background: '#e3f2fd',
      borderRadius: '8px',
      fontWeight: 500,
    },
    duration: 4000,
  });
};