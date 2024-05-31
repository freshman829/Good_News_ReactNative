import { createIcon } from "@gluestack-ui/themed"
import { Path, Rect } from "react-native-svg"

export const SendIcon = createIcon({
    viewBox: "0 0 1024 1024",
    path: (
        <>
            <Rect width="32" height="32" fill="currentColor" />
            <Path 
                d="M5.55172 4.74012L11.9192 2.61762C14.7767 1.66512 16.3292 3.22512 15.3842 6.08262L13.2617 12.4501C11.8367 16.7326 9.49672 16.7326 8.07172 12.4501L7.44172 10.5601L5.55172 9.93012C1.26922 8.50512 1.26922 6.17262 5.55172 4.74012Z" stroke="#09090B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="white"
            />
            <Path 
                d="M7.58203 10.2374L10.267 7.54492" stroke="#09090B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="white"
            />
        </>
    )
})