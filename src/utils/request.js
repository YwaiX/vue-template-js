import { useToken } from '@/stores/token.js'
import axios from "axios"
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  const { token } = useToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, function (error) {
  console.error('请求拦截器错误:', error)
  ElMessage.error('请求发送失败')
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  if (response.data.code && response.data.code !== 200) {
    ElMessage.error(response.data.msg || '请求失败')
    return Promise.reject(new Error(response.data.msg || '请求失败'))
  }
  return response.data
}, function (error) {
  console.error('响应拦截器错误:', error)
  if (error.response) {
    const status = error.response.status
    switch (status) {
      case 401:
        ElMessage({
          type: 'warning',
          message: '未登录或登录已过期，请重新登录'
        })
        break
      case 403:
        ElMessage({
          type: 'warning',
          message: '权限不足'
        })
        break
      case 404:
        ElMessage({
          type: 'warning',
          message: '请求地址不存在'
        })
        break
      case 419:
        ElMessage({
          type: 'warning',
          message: '登录过期,请重新登录'
        })
        break
      case 500:
        ElMessage({
          type: 'warning',
          message: '服务器错误，请稍后再试'
        })
        break
      default:
        ElMessage({
          type: 'warning',
          message: error.response.data?.msg || '请求错误'
        })
    }
  } else {
    ElMessage({
      type: 'warning',
      message: '网络错误或服务器未响应'
    })
  }
  return Promise.reject(error)
})

export default request