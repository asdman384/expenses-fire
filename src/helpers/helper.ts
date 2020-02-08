import { ExpenseNcategory } from "src/models/expense-info";


export class Helper {

    public static reduceByCategory(dataSet: ExpenseNcategory[]): ExpenseNcategory[] {
        var result = new Array<ExpenseNcategory>();
        var data = Helper.groupBy(dataSet, 'catId');

        for (const key in data)
            result.push({
                catId: data[key][0].catId,
                categoryName: data[key][0].categoryName,
                amount: data[key].reduce((p, c) => p + c.amount, 0),
                date: null
            });

        return result;
    }

    public static sortBy(field: string, order?: 'desc' | 'asc') {
        return function (a, b) {
            return order == 'asc' ? a[field] - b[field] : b[field] - a[field]
        }
    }

    public static groupBy<T>(xs: T[], key: string): { [key: string]: T[] } {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

}