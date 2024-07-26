package p3;

import java.time.LocalTime;

/**
 * 40100099 joshua ohagan
 * Abstract class which represents a flight
 */
public abstract class Flight {
	
	
	/**
	 * flight number of given flight
	 */
	private String flightNumber;
	
	/**
	 * airline carrier for given flight
	 */
	private String airline;
	
	/**
	 * scheduled departure time for given flight
	 */
	private LocalTime departureTime;
	
	
	
	
	/**
	 * get this flights flightNumber
	 * @return - return this flights flightNumber as a String
	 */
	public String getFlightNumber() {
		return flightNumber;
	}
	
	/**
	 * set this flights flightNumber
	 * @param flightNumber - String - the flightnumber to be set to
	 */
	public void setFlightNumber(String flightNumber) {
		this.flightNumber = flightNumber;
	}
	
	
	/**
	 * get this flights airline carrier
	 * @return - String - the airline carrier for this flight
	 */
	public String getAirline() {
		return airline;
	}
	
	/**
	 * set this flights airline
	 * @param airline - String - the airline to be set to
	 */
	public void setAirline(String airline) {
		this.airline = airline;
	}
	
	/**
	 * get this flights departureTime
	 * @return - LocalTime - this flights departureTime
	 */
	public LocalTime getDepartureTime() {
		return departureTime;
	}
	
	/**
	 * set this flights departureTime
	 * @param departureTime - LocalTime - the time departureTime should be set to
	 */
	public void setDepartureTime(LocalTime departureTime) {
		this.departureTime = departureTime;
	}
	
	/**
	 * default constructor for this class - returns a Flight with all values set to null,
	 * as flight is an abstract class - this cannot be called directly
	 */
	public Flight() {
		
	}
	
	/**
	 * constructor with args - returns a flight with values set according to arguments
	 * as Flight is an abstract class - this cannot be called directly
	 * @param flightNumber - String - flightNumber to be set
	 * @param airline - String - airline to be set
	 * @param departureTime - LocalTime - departureTime to be set
	 */
	public Flight(String flightNumber, String airline, LocalTime departureTime) {
		super();
		this.flightNumber = flightNumber;
		this.airline = airline;
		this.departureTime = departureTime;
	}
	
	
	
	
	
	
	

	
	
	
	
}
