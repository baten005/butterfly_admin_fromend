const initialState = {
    collapsed: false,
  };
  
  const sidebarReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'TOGGLE_SIDEBAR':
        return {
          ...state,
          collapsed: !state.collapsed,
        };
      default:
        return state;
    }
  };
  
  export default sidebarReducer;
  