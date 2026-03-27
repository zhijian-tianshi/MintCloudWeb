import type { ApiResult, PageParam, PageResult } from '~/types/global'
import { request } from '~/utils/request'

enum Api {
  Realtime = '/iot/telemetry/realtime',
  HistoryPage = '/iot/telemetry/history/page',
  HistoryTrend = '/iot/telemetry/history/trend',
  HistorySummary = '/iot/telemetry/history/summary',
  HistoryDevices = '/iot/telemetry/history/devices',
}

export interface TelemetryQueryModel {
  deviceId?: string
  startTime?: string
  endTime?: string
}

export interface TelemetryRealtimeItem {
  deviceId: string
  windowStart: string
  windowEnd: string
  sampleCount: number
  tempAvg: number
  humidityAvg: number
  pm25Avg: number
  co2Avg: number
  tvocAvg: number
  aqiAvg: number
  motionCount: number
  motionAny: boolean
}

export interface TelemetryHistoryItem {
  id: string | number
  deviceId: string
  recordDate: string
  windowStart: string
  windowEnd: string
  sampleCount: number
  tempAvg: number
  tempMin: number
  tempMax: number
  humidityAvg: number
  humidityMin: number
  humidityMax: number
  pm25Avg: number
  pm25Min: number
  pm25Max: number
  co2Avg: number
  co2Min: number
  co2Max: number
  tvocAvg: number
  tvocMin: number
  tvocMax: number
  aqiAvg: number
  aqiMin: number
  aqiMax: number
  motionCount: number
  motionAny: boolean
}

export interface TelemetryTrendRequest {
  deviceId: string
  startTime?: string
  endTime?: string
  metrics: string[]
}

export interface TelemetryTrendPoint {
  windowStart: string
  windowEnd: string
  tempAvg?: number
  humidityAvg?: number
  pm25Avg?: number
  co2Avg?: number
  aqiAvg?: number
  motionCount?: number
}

export interface TelemetryTrendData {
  deviceId: string
  points: TelemetryTrendPoint[]
}

export interface TelemetrySummaryData {
  deviceId: string
  windowCount: number
  sampleCountTotal: number
  tempAvg: number
  tempMin: number
  tempMax: number
  humidityAvg: number
  pm25Avg: number
  co2Avg: number
  aqiAvg: number
  motionCountTotal: number
  motionAnyWindowCount: number
}

export function realtimeTelemetryApi(deviceId?: string) {
  return request.get<ApiResult<TelemetryRealtimeItem[]>>(Api.Realtime, {
    params: { deviceId },
  })
}

export function pageTelemetryHistoryApi(param: PageParam<TelemetryQueryModel>) {
  return request.post<ApiResult<PageResult<TelemetryHistoryItem>>>(Api.HistoryPage, {
    data: param,
  })
}

export function trendTelemetryHistoryApi(param: TelemetryTrendRequest) {
  return request.post<ApiResult<TelemetryTrendData>>(Api.HistoryTrend, {
    data: param,
  })
}

export function summaryTelemetryHistoryApi(param: TelemetryQueryModel) {
  return request.post<ApiResult<TelemetrySummaryData>>(Api.HistorySummary, {
    data: param,
  })
}

export function queryTelemetryDevicesApi() {
  return request.get<ApiResult<string[]>>(Api.HistoryDevices)
}
