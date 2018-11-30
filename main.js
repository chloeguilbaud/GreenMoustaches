var _ = require('lodash');

var helpers = require('./helpers.js')

const USERNAME = "GreenMoustaches";
const POSITION_ORIGINE = {
    lat: 0.5,
    lng: 0.5
};

var problems = {
    // 1000 commandes
    problem1: {
        problem_id: 'problem1',
        orders: helpers.parseCsv('problem1.csv')
    },
    // 3000 commandes
    problem2: {
        problem_id: 'problem2',
        orders: helpers.parseCsv('problem2.csv')
    },
    // 3500 commandes un peu spéciales
    problem3: {
        problem_id: 'problem3',
        orders: helpers.parseCsv('problem3.csv')
    }
};

var solve_problem_dumb = function (problem) {
    var solution = {
        problem_id: problem.problem_id,
        username: USERNAME,
        orders: []
    };

    var pos = POSITION_ORIGINE;

    while(problem.orders.length > 0) {
        console.log(problem.orders.length);
        // On prend la commande la plus proche et on l'ajoute au trajet du livreur
        var order = findClosestLowestBonus(problem.orders, pos, 5);
        solution.orders.push(order.order_id);

        // On garde en mémoire la nouvelle position du livreur
        pos.lat = order.pos_lat;
        pos.lng = order.pos_lng;

        // On retire la commande qui vient d'être réalisé
        problem.orders.splice(problem.orders.indexOf(order), 1);
    }
    return solution;
};

var findClosestOrder = function (orders, pos) {
    orders = orders.sort(function (orderA, orderB) {
        return helpers.compute_dist(orderA.pos_lat, orderA.pos_lng, pos.lat, pos.lng) <= helpers.compute_dist(orderB.pos_lat, orderB.pos_lng, pos.lat, pos.lng)
    });
    return orders[orders.length-1];
}

var findHighestBonus = function (orders, pos) {
    orders = orders.sort(function (orderA, orderB) {
        return !helpers.compare_bonus(orderA.amount, orderB.amount)
    });
    return orders[orders.length-1];
}

var findLowestBonus = function (orders) {
    orders = orders.sort(function (orderA, orderB) {
        return !helpers.compare_bonus(orderA.amount, orderB.amount)
    });
    return orders[orders.length-1];
}

var findClosestLowestBonus = function (orders, pos, distance) {
    console.log(orders[0].amount + orders[1].amount + orders[2].amount + orders[3].amount + orders[4].amount + orders[5].amount+ orders[6].amount + orders[7].amount + orders[8].amount)
    var result = helpers.closest_lowest(orders, pos, distance);
    console.log(result[0].amount + result[1].amount + result[2].amount + result[3].amount + result[4].amount + result[5].amount+ result[6].amount + result[7].amount + result[8].amount)
    result = result.sort(function (orderA, orderB) {
        return helpers.compare_bonus(orderA, orderB);
    })
    orders = result.concat(orders);
    return orders[orders.length-1];
}

var solution = solve_problem_dumb(problems.problem1);
helpers.send_solution(solution);
