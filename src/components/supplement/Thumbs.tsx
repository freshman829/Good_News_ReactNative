import { FlatList, Image, View } from "@gluestack-ui/themed"
import { ThumbsInfo } from "../../types/supplement";
import RNFS from "react-native-fs";
import { useEffect } from "react";
import { Dimensions } from "react-native";
import Video from "react-native-video";

interface ThumbsProps {
    thumbs: ThumbsInfo[]
};

const mediaDirectory = RNFS.DocumentDirectoryPath + '/';

const Thumbs: React.FC<ThumbsProps> = ({ thumbs }) => {
    const width = Dimensions.get('window').width;
    useEffect(() => {
        RNFS.mkdir(mediaDirectory);
        downloadMedia(thumbs);
    }, [thumbs]);

    const downloadMedia = async (files: ThumbsInfo[]) => {
        for (const file of files) {
            const localFilePath = mediaDirectory + file.name;
            const fileExists = await RNFS.exists(localFilePath);

            console.log("localFilePath", localFilePath);
            
            if (!fileExists || file.lastUpdated !== (await RNFS.stat(localFilePath)).mtime.toString()) {
                console.log("fileExists", fileExists);
                await RNFS.downloadFile({
                    fromUrl: file.url,
                    toFile: localFilePath
                }).promise;
            }
        }
    };

    const renderImage = (item : ThumbsInfo) => {
        const filePath = `file://${mediaDirectory}${item.name}`;

        if (item.type == 'video') {
            return (
                <Video
                    source={{ uri: filePath }}
                    style={{ width: width, height: 290, borderRadius: 5 }}
                    controls={true}
                    resizeMode="cover"
                />
            )
        } else {
            return (
                <Image 
                    mb="$2"
                    h={290}
                    w={width}
                    borderRadius={5}
                    source={{
                        uri: filePath,
                    }}
                    alt=""   
                />
            )
        }
    }
    return (
        <View flex={1}>
            <FlatList 
                data={thumbs}
                renderItem={({item}) => renderImage(item)}
                keyExtractor={(item) => item.name}
                horizontal
                pagingEnabled
            />
        </View>
    )
}

export default Thumbs;