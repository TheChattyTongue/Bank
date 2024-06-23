import { SERVER_URL } from '@/config/url.config'

import { NotificationService } from '../services/notification.service'
import { StorageService } from '../services/storage.service'

import { ExtractErrorMessage } from './extract-error-message'
import { ACCESS_TOKEN_KEY } from '@/constansts/auth.constants'

export async function redQuery({
	path,
	body = null,
	headers = {},
	method = 'GET',
	onError = null,
	onSuccess = null
}) {
	let isLoading = true
	let error = null
	let data = null
	const url = `${SERVER_URL}/api${path}`

	const accessToken = new StorageService().getItem(ACCESS_TOKEN_KEY)

	const requestOptions = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...headers
		}
	}

	if (accessToken) {
		requestOptions.headers.Authorization = `Bearer ${accessToken}`
	}

	if (body) {
		requestOptions.body = JSON.stringify(body)
	}

	try {
		const response = await fetch(url, requestOptions)

		if (response.ok) {
			data = await response.json()
			if (onSuccess) {
				onSuccess(data)
			}
		} else {
			const errorData = await response.json()
			const errorMessage = ExtractErrorMessage(errorData)

			if (onError) {
				onError(errorMessage)
			}

			new NotificationService().show('error', errorMessage)
		}
	} catch (errorData) {
		const errorMessage = ExtractErrorMessage(errorData)
		if (onError) {
			onError(errorMessage)
		}

		new NotificationService().show('error', errorMessage)
	} finally {
		isLoading = false
	}

	return { isLoading, error, data }
}
