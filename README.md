
Installation
-----------

npm install react-native-match-sketchpad --save


How To Use
-----------

```
import { Sketchpad } from "react-native-match-sketchpad";

let sketchData = '{"background": [{"image": "/sap/sports/fnd/appsvc/resources/service/resources.xsjs/SKETCHPAD_BACKGROUND","scaleFactor": 1}],"items": []}';

let width = Dimension.get("window").width;

let isEditMode = true;

<View>
...
<Sketchpad fullMode={false} data={sketchData} isEditable={isEditMode} width={width} />
...
</View>
```