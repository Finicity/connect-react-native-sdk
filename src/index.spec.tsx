import React from 'react';
import renderer from 'react-test-renderer';
import { ConnectEventHandlers, FinicityConnect } from './index';



describe('FinicityConnect component testing', () => {

  let eventHandlerFns: ConnectEventHandlers = {
    cancel: (event: any) => {
      console.log('cancel event received', event);
    },
    done: (event: any) => {
      console.log('done event received', event);
    },
    error: (event: any) => {
      console.log('error event received', event);
    },
    loaded: (event: any) => {
      console.log('loaded event received', event);
    },
    route: (event: any) => {
      console.log('route event received', event);
    },
    user: (event:any ) => {
      console.log('user event received', event);
    },
  }

  // it('should match to snapshot', () => {
  //   const fc = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />);
  //   let json = fc.toJSON();
  //   expect(json).toMatchSnapshot();
  // });

  it('test close', () => {
    const instanceOf = renderer.create(<FinicityConnect connectUrl="https://finicity.com" eventHandlers={eventHandlerFns} linkingUri='' />).getInstance() as unknown as FinicityConnect;
    const mockFn = jest.fn();
    instanceOf.state.eventHandlers.cancel = mockFn;
    instanceOf.close();
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenLastCalledWith({code: 100, reason: 'exit',})
  })

});