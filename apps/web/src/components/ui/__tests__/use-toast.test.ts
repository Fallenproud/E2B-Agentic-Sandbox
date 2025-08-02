import { describe, it, expect } from 'vitest'
import { reducer, actionTypes } from '../use-toast'

describe('use-toast reducer', () => {
  const baseToast = {
    id: '1',
    title: 'Hello',
    description: 'World',
    open: true,
  }

  it('adds a toast with ADD_TOAST', () => {
    const state = reducer({ toasts: [] }, {
      type: actionTypes.ADD_TOAST,
      toast: baseToast,
    })
    expect(state.toasts).toHaveLength(1)
    expect(state.toasts[0]).toMatchObject(baseToast)
  })

  it('updates a toast with UPDATE_TOAST', () => {
    const state = reducer({ toasts: [baseToast] }, {
      type: actionTypes.UPDATE_TOAST,
      toast: { id: '1', title: 'Updated' },
    })
    expect(state.toasts[0].title).toBe('Updated')
  })

  it('dismisses a toast with DISMISS_TOAST', () => {
    const state = reducer({ toasts: [baseToast] }, {
      type: actionTypes.DISMISS_TOAST,
      toastId: '1',
    })
    expect(state.toasts[0].open).toBe(false)
  })

  it('removes a toast with REMOVE_TOAST', () => {
    const state = reducer({ toasts: [baseToast] }, {
      type: actionTypes.REMOVE_TOAST,
      toastId: '1',
    })
    expect(state.toasts).toHaveLength(0)
  })

  it('rejects invalid action types at compile time', () => {
    // @ts-expect-error - invalid action type
    reducer({ toasts: [] }, { type: 'INVALID', toast: baseToast })
  })
})
