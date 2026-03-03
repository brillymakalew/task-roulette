'use client'

import { useActionState } from 'react'
import { authenticate } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormStatus } from 'react-dom'

function LoginButton() {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full mt-4" aria-disabled={pending} type="submit" disabled={pending}>
            {pending ? 'Logging in...' : 'Log in'}
        </Button>
    )
}

export default function LoginPage() {
    const [errorMessage, formAction] = useActionState(authenticate, undefined)

    return (
        <main className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your username and password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Dian or Brilly"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>
                        {errorMessage && (
                            <div className="text-sm text-red-500 text-center">
                                {errorMessage}
                            </div>
                        )}
                        <LoginButton />
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}
