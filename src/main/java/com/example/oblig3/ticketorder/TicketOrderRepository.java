package com.example.oblig3.ticketorder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;


@Repository
public class TicketOrderRepository {

    private static class TicketOrderRowMapper
        implements RowMapper<TicketOrder> {
        @Override
        public TicketOrder mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new TicketOrder(
                rs.getInt("OrderId"),
                rs.getInt("MovieId"),
                rs.getInt("NumberOfTickets"),
                rs.getString("FirstName"),
                rs.getString("LastName"),
                rs.getString("PhoneNumber"),
                rs.getString("EmailAddress")
            );
        }
    }

    static final String SQL_GET_ORDER
        = "SELECT * FROM TicketOrder WHERE OrderId=?";
    static final String SQL_GET_ALL_ORDERS
        = "SELECT * FROM TicketOrder";
    static final String SQL_GET_ALL_ORDERS_BY_LASTNAME_ASC
        = "SELECT * FROM TicketOrder ORDER BY LastName";
    static final String SQL_DELETE_ORDER_BY_ID
        = "DELETE FROM TicketOrder WHERE OrderId=?";
    static final String SQL_DELETE_ALL_ORDERS =
        "TRUNCATE TABLE TicketOrder";

    private final JdbcTemplate jdbcTemplate;
    private final TicketOrderRowMapper rowMapper;
    private final SimpleJdbcInsert insertTicketOrder;

    @Autowired
    public TicketOrderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.rowMapper = new TicketOrderRowMapper();
        this.insertTicketOrder = new SimpleJdbcInsert(jdbcTemplate)
            .withTableName("TicketOrder")
            .usingGeneratedKeyColumns("OrderId");
    }

    public Integer addOrder(TicketOrder ticketOrder) {
        SqlParameterSource params =
            new BeanPropertySqlParameterSource(ticketOrder);
        Number newId = insertTicketOrder.executeAndReturnKey(params);
        return newId.intValue();
    }

    public List<TicketOrder> getAllOrders() {
        return jdbcTemplate.query(SQL_GET_ALL_ORDERS, rowMapper);
    }

    public List<TicketOrder> getAllOrders(String orderBy) {
        if (orderBy.equals("lastname.asc")) {
            return jdbcTemplate.query(
                SQL_GET_ALL_ORDERS_BY_LASTNAME_ASC, rowMapper
            );
        }
        return getAllOrders();
    }
    
    public TicketOrder getOrder(int orderId) {
        return jdbcTemplate.queryForObject(
            SQL_GET_ORDER, rowMapper, orderId
        );
    }

    public Integer deleteOrderById(int orderId) {
        return jdbcTemplate.update(SQL_DELETE_ORDER_BY_ID, orderId);
    }

    public Integer deleteAllOrders() {
        return jdbcTemplate.update(SQL_DELETE_ALL_ORDERS);
    }
}
