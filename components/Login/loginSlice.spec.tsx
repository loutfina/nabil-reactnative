import reducer, { setData, setBusy, setError } from "./loginSlice";


const buildInitialState = (username, busy=false, errorStatus=null, errorMessage=null) => {
  return {
      user: username ? {id:1, name:username} : null, 
      busy: busy,
      error: {
        status : errorStatus,
        message : errorMessage
      }
  };
}

const userTest = {id: 1, name:"Nabil"};

/*
//  Reducer tests  //
A reducer should just return a new state object after applying an action to the previous state.
So for the reducer I introduced above, we can simply do:
*/
describe('login reducer ', () => {
  it.each`
  flag
  ${true}
  ${false}
  `('should set as busy', ({flag}) => {
    const initialState = buildInitialState(null, !flag);
    const nextState=reducer(initialState, setBusy(flag));
    expect(nextState).toStrictEqual({...initialState, busy: flag});
  })

  it('should set Error and reset busy ', () => {
    const initialState = buildInitialState(null, true);
    const nextState=reducer(initialState, setError({status: 404, message:"Page not found!"}));
    expect(nextState).toStrictEqual({...initialState, busy: false, error: {status: 404, message:"Page not found!"}});
  })

  it('should set Data and reset error and busy', () => {
    const initialState = buildInitialState(null, true,404,"Page not found!");
    const nextState=reducer(initialState, setData(userTest));
    const expectedState = buildInitialState(userTest.name);
    expect(nextState).toStrictEqual(expectedState);
  })

});



import { createUser, fetchUserByName, ACTION } from "./loginAction";
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import httpNabilMiddleware from '../Store';
import apiService from '../ApiService';

const middlewares = [thunk, httpNabilMiddleware];
const mockStore = configureMockStore(() => [thunk, httpNabilMiddleware]);

jest.spyOn(apiService, 'get');
//jest.mock("apiService");

/*
//  Action tests  //
All we care about here is that the correct action creator was called and it returned the right action. 
So unit tests should only know about actions/events and state.
*/
describe('login action fetch user by name', async () => {

  let store;
  // set up a fake store for all our tests
  beforeEach(() => {
    store = mockStore(buildInitialState());
  });

  it('should fires a custom action with "http" ', () => {
    apiService.get.mockResolvedValueOnce(userTest);
    store.dispatch(fetchUserByName(userTest.name))
      .then(() => {
          let actions = store.getActions();
          return expect(action.type).toContainEqual(ACTION.fetchUserByName)
              && expect(action.payload.http).toBeDefined()
              && expect(action.payload.http.query).toContainEqual({ username: userTest.name }); 
      }).then(()=>{
        expect(apiService.get).toHaveBeenCalled();
      });
  })
});

