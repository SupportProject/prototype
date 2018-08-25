
export default {
  getNotification: state => {
    let notificationsQueue = state.notificationsQueue
    console.log('Queue: ', notificationsQueue)
    if (notificationsQueue.length > 0) {
      return notificationsQueue.shift()
    }
    return false
  },
  isAuthenticated: state => {
    return state.user.loggedIn !== null &&
    state.user.loggedIn !== undefined &&
    state.user.loggedIn !== false
  },
  allUsers: (state) => (excludeLoggedinUser = false) => {
    let allUsers = state.allUsers
    if (excludeLoggedinUser) {
      allUsers = allUsers.filter(x => x.ethAccount !== state.userDetails.ethAccount)
    }
    return allUsers
  }

}
