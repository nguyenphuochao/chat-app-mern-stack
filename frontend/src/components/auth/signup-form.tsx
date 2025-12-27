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

const signUpSchema = z.object({
    firstname: z.string().min(1, "Vui lòng nhập tên"),
    lastname: z.string().min(1, "Vui lòng nhập họ"),
    username: z.string().min(3, "Vui lòng nhập tên đăng nhập ít nhất 3 ký tự"),
    email: z.email("Vui lòng nhập đúng định dạng email"),
    password: z.string().min(6, "Vui lòng nhập password ít nhất 6 kí tự")
})

// Infer the TypeScript type from the schema
type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
    const navigate = useNavigate();
    const { signUp } = useAuthStore();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormValues) => {
        const { firstname, lastname, username, email, password } = data
        // call api backend
        await signUp(firstname, lastname, username, email, password);
        navigate("/signin");
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

                                <h1>Tạo tài khoản Moji</h1>
                                <p className="text-muted-foreground text-balance">Chào mừng bạn! Hãy đăng kí để bắt đầu</p>
                            </div>

                            {/* firstname & lastname */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="lastname" className="block tetx-sm">Họ</Label>
                                    <Input {...register("lastname")} type="text" id="lastname" />
                                    {/* todo: error message */}
                                    {errors.lastname && <span className="text-red-500 text-sm">{errors.lastname.message}</span>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="firstname" className="block tetx-sm">Tên</Label>
                                    <Input {...register("firstname")} type="text" id="firstname" />
                                    {/* todo: error message */}
                                    {errors.firstname && <span className="text-red-500 text-sm">{errors.firstname.message}</span>}
                                </div>
                            </div>

                            {/* username */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="username" className="block tetx-sm">Tên đăng nhập</Label>
                                <Input {...register("username")} type="text" id="username" placeholder="Moji" />
                                {/* todo: error message */}
                                {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                            </div>

                            {/* email */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="email" className="block tetx-sm">Email</Label>
                                <Input {...register("email")} type="text" id="email" />
                                {/* todo: error message */}
                                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                            </div>

                            {/* password */}
                            <div className="flex flex-col gap-3">
                                <Label htmlFor="password" className="block tetx-sm">Mật khẩu</Label>
                                <Input {...register("password")} type="password" id="password" />
                                {/* todo: error message */}
                                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                            </div>

                            {/* button register */}
                            <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">Đăng ký</Button>

                            <div className="text-center text-sm">
                                Đã có tài khoản? {" "}
                                <Link to="/signin" className="underline underline-offset-4">Đăng nhập</Link>
                            </div>
                        </div>
                    </form>

                    <div className="bg-muted relative hidden md:block">
                        <img
                            src="/placeholderSignUp.png"
                            alt="Image"
                            className="absolute top-1/2 -translate-y-1/2 object-cover"
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
