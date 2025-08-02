import React, { useState } from 'react';
import { Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { getAllMockData } from './StatisticsAPI';
import { 
  FaUsers, 
  FaMoneyBillWave, 
  FaCheckCircle, 
  FaClock,
  FaChartLine,
  FaHotel,
  FaStar
} from 'react-icons/fa';

const MockDataTest = () => {
  const [mockData] = useState(getAllMockData());
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="p-4">
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">
            <FaChartLine className="me-2" />
            Mock Data Test - Statistics Dashboard
          </h5>
        </Card.Header>
        <Card.Body>
          <p className="text-muted">
            This component demonstrates the mock data available for the statistics dashboard.
            The data includes realistic hotel booking statistics for testing and development.
          </p>
          
          <Button 
            variant="outline-primary" 
            onClick={() => setShowDetails(!showDetails)}
            className="mb-3"
          >
            {showDetails ? 'Hide Details' : 'Show All Mock Data'}
          </Button>

          {/* Key Metrics */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaUsers className="text-primary mb-2" size={24} />
                  <h4>{mockData.comprehensiveStats.booking.total}</h4>
                  <p className="text-muted mb-0">Total Bookings</p>
                  <Badge bg="success" className="mt-2">
                    {mockData.comprehensiveStats.booking.confirmationRate}% Confirmed
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaMoneyBillWave className="text-success mb-2" size={24} />
                  <h4>{formatCurrency(mockData.comprehensiveStats.revenue.total)}</h4>
                  <p className="text-muted mb-0">Total Revenue</p>
                  <Badge bg="info" className="mt-2">
                    {formatCurrency(mockData.comprehensiveStats.revenue.averagePerBooking)} avg
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaCheckCircle className="text-info mb-2" size={24} />
                  <h4>{mockData.comprehensiveStats.customer.newCustomers}</h4>
                  <p className="text-muted mb-0">New Customers</p>
                  <Badge bg="primary" className="mt-2">
                    This Month
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center">
                <Card.Body>
                  <FaClock className="text-warning mb-2" size={24} />
                  <h4>{mockData.comprehensiveStats.requests.pending}</h4>
                  <p className="text-muted mb-0">Pending Requests</p>
                  <Badge bg="warning" className="mt-2">
                    Needs Attention
                  </Badge>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Real-time Stats */}
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">
                <FaStar className="me-2" />
                Real-time Statistics
              </h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="text-center">
                    <h5 className="text-primary">{mockData.realTimeStats.todayBookings}</h5>
                    <small className="text-muted">Today's Bookings</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h5 className="text-success">{formatCurrency(mockData.realTimeStats.todayRevenue)}</h5>
                    <small className="text-muted">Today's Revenue</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h5 className="text-info">{mockData.realTimeStats.totalRooms}</h5>
                    <small className="text-muted">Total Rooms</small>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="text-center">
                    <h5 className="text-warning">{mockData.realTimeStats.pendingRequests}</h5>
                    <small className="text-muted">Pending Requests</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Detailed Mock Data */}
          {showDetails && (
            <div>
              <h6 className="mb-3">All Available Mock Data:</h6>
              
              {/* Room Types */}
              <Card className="mb-3">
                <Card.Header>
                  <FaHotel className="me-2" />
                  Room Type Statistics
                </Card.Header>
                <Card.Body>
                  <Row>
                    {mockData.roomTypeStats.map((room, index) => (
                      <Col md={4} key={index}>
                        <div className="text-center p-3 border rounded">
                          <h6>{room.type}</h6>
                          <p className="mb-1">Count: {room.count}</p>
                          <p className="mb-1">Occupancy: {room.occupancy}%</p>
                          <p className="mb-0">Revenue: {formatCurrency(room.revenue)}</p>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              {/* Top Rooms */}
              <Card className="mb-3">
                <Card.Header>Top Performing Rooms</Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Room</th>
                          <th>Type</th>
                          <th>Bookings</th>
                          <th>Revenue</th>
                          <th>Occupancy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockData.topRooms.map((room, index) => (
                          <tr key={index}>
                            <td>{room.roomNumber}</td>
                            <td>{room.type}</td>
                            <td>{room.bookings}</td>
                            <td>{formatCurrency(room.revenue)}</td>
                            <td>{room.occupancy}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>

              {/* Payment Statistics */}
              <Card className="mb-3">
                <Card.Header>Payment Statistics</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6>Payment Methods</h6>
                      {mockData.paymentStats.paymentMethods.map((method, index) => (
                        <div key={index} className="d-flex justify-content-between mb-2">
                          <span>{method.method}</span>
                          <span>{method.count} ({method.percentage}%)</span>
                        </div>
                      ))}
                    </Col>
                    <Col md={6}>
                      <h6>Payment Summary</h6>
                      <p>Total Payments: {mockData.paymentStats.totalPayments}</p>
                      <p>Paid: {mockData.paymentStats.paidPayments}</p>
                      <p>Unpaid: {mockData.paymentStats.unpaidPayments}</p>
                      <p>Payment Rate: {mockData.paymentStats.paymentRate}%</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Customer Satisfaction */}
              <Card className="mb-3">
                <Card.Header>Customer Satisfaction</Card.Header>
                <Card.Body>
                  <div className="text-center mb-3">
                    <h4>Average Rating: {mockData.satisfactionStats.averageRating}/5</h4>
                    <p className="text-muted">Based on {mockData.satisfactionStats.totalReviews} reviews</p>
                  </div>
                  <Row>
                    {mockData.satisfactionStats.ratingDistribution.map((rating, index) => (
                      <Col md={2} key={index} className="text-center">
                        <div className="border rounded p-2">
                          <h6>{rating.rating} ⭐</h6>
                          <p className="mb-1">{rating.count}</p>
                          <small className="text-muted">{rating.percentage}%</small>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default MockDataTest; 