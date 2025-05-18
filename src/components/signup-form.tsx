import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SignupFormProps {
  onSignupClick: () => void
  onLoginClick: () => void
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}


export function SignupForm({
    className,
    ...props
}: SignupFormProps) {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <Card>
                <CardHeader>
                    <CardTitle>Signup</CardTitle>
                    <CardDescription>
                        Create an account to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Johndoe"
                                onChange = {props.onUsernameChange}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                onChange = {props.onEmailChange}
                            />
                        </div>
                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input id="password" type="password"
                                onChange = {props.onPasswordChange}
                            />
                        </div>
                        <div className="grid gap-3">
                            <div className="flex items-center">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                            </div>
                            <Input id="confirmPassword" type="password"
                                onChange = {props.onConfirmPasswordChange}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button type="submit" className="w-full" onClick={props.onSignupClick}>
                                Signup
                            </Button>
                        </div>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <a className="underline underline-offset-4" onClick={props.onLoginClick}>
                            Login
                        </a>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      )
}
