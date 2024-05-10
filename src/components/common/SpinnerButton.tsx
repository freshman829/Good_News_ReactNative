import * as React from "react";
import { Button, ButtonSpinner } from "@gluestack-ui/themed";
import { ViewStyle } from "react-native";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
}

const SpinnerButton = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { children, isLoading, ...rest } = props;

    return (
        <Button {...rest} style={rest.style as StyleProp<ViewStyle>}>
            {isLoading && <ButtonSpinner />}
            {children}
        </Button>
    );
});

export default SpinnerButton;