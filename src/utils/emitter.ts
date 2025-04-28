import mitt, { Emitter } from 'mitt'


const emitter: Emitter<any> =
  typeof window === 'undefined'
    ? {
        all: new Map(),
        on: () => {
          console.error('emitter should not be invoked on server side')
        },
        off: () => {
          console.error('emitter should not be invoked on server side')
        },
        emit: () => {
          console.error('emitter should not be invoked on server side')
        },
      }
    : mitt()

export default emitter
