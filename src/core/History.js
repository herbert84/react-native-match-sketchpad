import * as _ from "lodash";
/**
 *
 * @description 这是记录所有操作历史的类
 * @class History
 */
class History {
    constructor() {
        this.history = []
    }
    setInitialData(initialData) {
        this.history.push({
            data: initialData,
            operation: "initial"
        });
    }
    addOperationData(data, operation) {
        this.history.push({ data, operation });
    }
    undoLastOperation() {
        this.history = _.dropRight(this.history);
    }
    backToInitialData() {
        this.history = [this.history[0]]
    }
    getAll() {
        return this.history;
    }
    removeAll() {
        this.history = []
    }

}
export default History;