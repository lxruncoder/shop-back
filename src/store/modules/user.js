import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // login方法就返回的就是一个二次封装的aixos发送请求后返回的promie实例
      // 如果该实例的状态为成功,调用then中指定的成功回调,value就是成功的数据,如果失败了,在相应拦截器中,返回了一个状态为失败的Promise实例,导致login方法返回的promise实例
      // 是失败的,失败的原因就是响应拦截器中抛出的错误对象
      // axios任务状态码不是以2开头的都算失败

      login({ username: username.trim(), password: password })
        .then((response) => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          setToken(data.token) // 登录之后存储token,这里借助了一个第三方包,在utils/auth中
          resolve() // 返回成功状态的promise
        })
        .catch((error) => {
          // 如果出现错误,则封装的axios返回了一个状态为失败的Promise实例对象,则login返回的Promise实例的状态就是失败的,然后就走catch,就能捕获到该错误对象
          // 这里的错误对象是啥得看是自己抛出的,还是请求失败axios抛出的
          reject(error)
          // console.log(error)
        })
    })
  },
  /* async login({ commit }, userInfo){
    const { username, password } = userInfo
    try {
      const result = await login({ username: username.trim(), password: password })
      if(result.code === 20000) {
        const { data } = result
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        // 保证该函数最后返回的还是一个promise实例
        return 'ok'
      }
    } catch (error) {
      // 这里的error就是导致axios请求失败,响应拦截器抛出的对象
      console.log(error)
      return Promise.reject(error)
    }
  }, */

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          const { name, avatar } = data
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
