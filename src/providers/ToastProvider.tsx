import { HStack, Toast, ToastDescription, ToastTitle, VStack, useToast } from "@gluestack-ui/themed";
import { ReactNode, createContext, useCallback, useContext } from "react";
type ToastOption = "error" | "warning" | "success" | "info" | "attention" | undefined;

interface ToastContextType {
    showToast: (data: { title?: string, message: string, options?: ToastOption }) => void;
}


const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}
export const useToastr = () => useContext(ToastContext);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const toast = useToast();
    const showToast = useCallback((data: { title?: string, message: string, action?: ToastOption }) => {
    try {
        toast.show({
            placement: "top",
            render: ({ id }) => {
                const toastId = "toast-" + id.toString();
                return (
                    <Toast
                        nativeID={toastId}
                        action={data.action}
                        variant="accent"
                        style={{
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5, // Only for Android
                            borderRadius: 10,
                            borderWidth: 1,
                        }}
                    >
                        <VStack space="sm">
                            {data.title ?<ToastTitle style={{ fontSize: 18, fontWeight: 'bold' }}>{data.title}</ToastTitle> : ""}
                            <ToastDescription style={{ fontSize: 14 }}>
                                {data.message}
                            </ToastDescription>
                        </VStack>
                    </Toast>
                )
            },
        })
    } catch (error) {
        console.log(error);
    }

}, []);

return (
    <ToastContext.Provider value={{ showToast }}>
        {children}
    </ToastContext.Provider>
)
}