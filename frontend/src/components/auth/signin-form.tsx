import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Button } from "../ui/button"
import { Link, useNavigate } from "react-router"
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from "@/stores/useAuthStore"

const signInSchema = z.object({
  username: z.string().min(3, "Vui lòng nhập tên đăng nhập ít nhất 3 ký tự"),
  password: z.string().min(6, "Vui lòng nhập password ít nhất 6 kí tự")
});

// Infer the TypeScript type from the schema
type SignInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const navigate = useNavigate();
  const { signIn } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    const { username, password } = data
    // call api backend
    await signIn(username, password);
    navigate("/");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
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
                <Input {...register("username")} type="text" id="username" placeholder="Moji" />
                {/* todo: error message */}
                {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
              </div>

              {/* password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="block tetx-sm">Mật khẩu</Label>
                <Input {...register("password")} type="password" id="password" />
                {/* todo: error message */}
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              </div>

              {/* button login */}
              <Button disabled={isSubmitting} type="submit" className="w-full cursor-pointer">Đăng nhập</Button>

              <div className="text-center text-sm">
                Chưa có tài khoản? {" "}
                <Link to="/signup" className="underline underline-offset-4">Đăng ký</Link>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      {/* policy */}
      <div className="px-6 text-center *:[a]:hover:text-primary">
        Bằng cách nhấp vào tiếp tục, bạn đồng ý với chúng tôi <a href="#" className="underline underline-offset-2">Điều khoản dịch vụ</a>{" "}
        và <a href="#">Chính sách bảo mật</a>.
      </div>
    </div>
  )
}
