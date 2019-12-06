/**
 *
 * @description 这是记录所有操作历史的类
 * @class History
 */
class History {
    constructor() {
        this.history = []
    }
    addOperation(operation) {
        this.history.push(operation);
    }
    undoLastOperation() {

    }
    getAll() {
        return this.history;
    }
    removeAll() {
        this.history = []
    }

}
export default new History();