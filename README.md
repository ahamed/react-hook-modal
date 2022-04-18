# React Hook Modal

## Motivation
The basic idea is to open a modal dynamically. For example you can open a modal inside any conditional, on a button click or many more.
This package is created only for using the modal functionalities and leave the modal content component to the user. 
This package is allowing the developers to create their own modal content component and also allowing them to provide extensive
data passing on closing the modal.


## Features
- Hook based implementation
- Easy to use
- Only `showModal` and `closeModal` functions are enough.
- Ability to send custom data after closing the modal.
- Multiple actions on close are available.
- Could be used as a confirm popover.

## Installation
```
npm install @ahamed07/react-hook-modal
```
or

```
yarn add @ahamed07/react-hook-modal
```

## Usage
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ModalProvider, useModal } from '@ahamed07/react-hook-modal';

const ModalContent = ({title, content}) => {
	const { closeModal } = useModal();
	return (
    <div>
      <h1>{title}</h1>
      <div>{content}</div>

      <button
        type="button"
        onClick={() => closeModal({
          action: 'CLOSE', data: {name: 'john doe', age: 32}
        })}
      >
        Close Modal
      </button>
    </div>
	)
}

const  App = () => {
  const { showModal } = useModal();

  return (
    <div>
      <h1> React Hook Modal Example </h1>
      <button
        type="button"
        onClick={async () => {
          const { action } = await showModal({
            component: ModalContent,
            props: {
              title: 'This is a simple modal title',
              content: 'Lorem ipsum dolor...'
            }
          });

          if (action === 'CLOSE') {
            // Do some stuff here
          }
        }}
      >
        Open Modal
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ModalProvider>
    <App />
  </ModalProvider>
)

```