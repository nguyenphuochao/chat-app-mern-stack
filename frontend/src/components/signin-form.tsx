import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Button } from "./ui/button"
import { Link } from "react-router"

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* header - logo */}
              <div className="flex flex-col items-center text-center gap-2">
                <a href="#" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="logo" />
                </a>

                <h1>Đăng nhập tài khoản Moji</h1>
                <p className="text-muted-foreground text-balance">Chào mừng bạn! Hãy đăng nhập để bắt đầu</p>
              </div>

              {/* username */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="block tetx-sm">Tên đăng nhập</Label>
                <Input type="text" id="username" placeholder="Moji" />
                {/* todo: error message */}
              </div>

              {/* password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block tetx-sm">Mật khẩu</Label>
                <Input type="password" id="password" />
                {/* todo: error message */}
              </div>

              {/* button login */}
              <Button type="submit" className="w-full cursor-pointer">Đăng nhập</Button>

              <div className="text-center text-sm">
                Chưa có tài khoản? {" "}
                <Link to="/signup" className="underline underline-offset-4">Đăng ký</Link>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholderSignUp.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      {/* policy */}
      <div className="px-6 text-center *:[a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#" className="underline underline-offset-2">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
