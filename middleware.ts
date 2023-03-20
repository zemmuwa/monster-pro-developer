import { NextRequest, NextResponse } from 'next/server'
import localStorage from 'redux-persist/es/storage'
import { store } from './redux'
export async function middleware(request: NextRequest) {
	return NextResponse.next()
}