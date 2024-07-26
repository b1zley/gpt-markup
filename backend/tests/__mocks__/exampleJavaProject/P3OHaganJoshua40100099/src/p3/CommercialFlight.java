package p3;

import java.time.LocalTime;

/**
 * 40100099 joshua ohagan
 * Concrete class which extends abstract class flight - represents a commercial flight - stores all variables assocaited with commercial flight and gives speciifc methods for modification and 
 * data access
 */
public class CommercialFlight extends Flight {
	
	
	
	/**
	 * the destination for this commercialflight object
	 */
	private String destination;
	
	/**
	 * the country for this commercialflight object
	 */
	private String country;
	
	/**
	 * the gate for this commercialflight object
	 */
	private String gate;
	
	/**
	 * the airport code for this commercialflight object
	 */
	private String airportCode;
	
	/**
	 * the boarding status for this commercialflight object
	 */
	private BoardingStatus boardingStatus;
	
	
	/**
	 * the number of passengers on the flight for this commercialflight object
	 */
	private int passengerNumber;
	
	// getters and setters - inherited from superclass - overidden

	
	
	/**
	 * overridden getter from superclass Flight - returns the flightNumber for this 
	 * CommercialFlight object
	 * @return - String - this flightNumber 
	 */
	@Override
	public String getFlightNumber() {
		// TODO Auto-generated method stub
		return super.getFlightNumber();
	}

	
	/**
	 * sets the flightNumber for this
	 * @param - flightNumber - String - flightNumber to be set
	 */
	@Override
	public void setFlightNumber(String flightNumber) {
		// TODO Auto-generated method stub
		super.setFlightNumber(flightNumber);
	}


	/**
	 * gets the airline for this
	 * @return - String - this objects airline
	 */
	@Override
	public String getAirline() {
		// TODO Auto-generated method stub
		return super.getAirline();
	}


	/**
	 * sets the airline for this
	 * @param - airline - String - the airline to be set
	 */
	@Override
	public void setAirline(String airline) {
		// TODO Auto-generated method stub
		super.setAirline(airline);
	}


	/**
	 * gets the departureTime for this
	 * @return - LocalTime - this objects localtime
	 */
	@Override
	public LocalTime getDepartureTime() {
		// TODO Auto-generated method stub
		return super.getDepartureTime();
	}

	
	/**
	 * sets the departuretime for this
	 * @param - LocalTime - departureTime - departureTime to be set
	 */
	@Override
	public void setDepartureTime(LocalTime departureTime) {
		// TODO Auto-generated method stub
		super.setDepartureTime(departureTime);
	}
	
	
	// getters and setters - just from subclass

	
	/**
	 * gets the airport code for this
	 *
	 * @return - String - the airport code for this object
	 */
	public String getAirportCode() {
		return airportCode;
	}

	/**
	 * sets the airport code for this
	 * @param airportCode - String - airportCode to be set
	 */
	public void setAirportCode(String airportCode) {
		this.airportCode = airportCode;
	}
	
	/**
	 * gets the destination for this
	 * 
	 * @return - String - this CommercialFlights destination
	 */
	public String getDestination() {
		return destination;
	}

	/**
	 * sets the destination for this
	 * 
	 * @param destination - String - destination to be set
	 */
	public void setDestination(String destination) {
		this.destination = destination;
	}

	
	/**
	 * gets the country for this 
	 * @return - String - this CommercialFlights country
	 */
	public String getCountry() {
		return country;
	}

	
	/**
	 * sets the country for this
	 * @param country - String - country to be set
	 */
	public void setCountry(String country) {
		this.country = country;
	}

	/**
	 * gets the gate for this
	 * @return - String - gate for this commercialFlight
	 */
	public String getGate() {
		return gate;
	}

	/**
	 * sets the gate for this
	 * @param gate - String - the gate to be set
	 */
	public void setGate(String gate) {
		this.gate = gate;
	}

	
	/**
	 * gets the boardingStatus for this 
	 * @return - BoardingStatus - the boarding status for this object
	 */
	public BoardingStatus getBoardingStatus() {
		return boardingStatus;
	}

	/**
	 * sets the boarding status for this
	 * @param boardingStatus - BoardingStatus - boardingStatus to be set
	 */
	public void setBoardingStatus(BoardingStatus boardingStatus) {
		this.boardingStatus = boardingStatus;
	}

	/**
	 * gets the passenger number for this
	 * @return - int -  the passenger number for this
	 */
	public int getPassengerNumber() {
		return passengerNumber;
	}

	/**
	 * sets the passengerNumber for this
	 * @param passengerNumber - int - the passenger number to be set
	 */
	public void setPassengerNumber(int passengerNumber) {
		this.passengerNumber = passengerNumber;
	}

	
	// combined constructor

	/**
	 * default constructor - initialize a CommercialFlight object with all values set as defaults 
	 */
	public CommercialFlight() {
		super();
	}
	

	
	
	
	/**
	 * constructor with args - initialize a CommercialFlight object with all values set acccording to arguments
	 * @param flightNumber - flightNumber to be set - String
	 * @param airline - airline to be set - String
	 * @param departureTime - departureTime to be set - LocalTime
	 * @param destination - destination to be set - String
	 * @param country - country to be set - String
	 * @param gate - gate to be set - String
	 * @param airportCode -airportCode to be set - String
	 * @param boardingStatus - boardingStatus to be set - BoardingStatus
	 * @param passengerNumber - passengerNumber to be set - int
	 */
	public CommercialFlight(String flightNumber, String airline, LocalTime departureTime, String destination, String country, String gate, String airportCode,
			BoardingStatus boardingStatus, int passengerNumber) {
		
		super(flightNumber, airline, departureTime);
		this.destination = destination;
		this.country = country;
		this.gate = gate;
		this.airportCode = airportCode;
		this.boardingStatus = boardingStatus;
		this.passengerNumber = passengerNumber;
	}


	
	/**
	 * overridden to string method
	 */
	@Override
	public String toString() {
		
		StringBuilder sb = new StringBuilder();
		String newLine = "\n";
		sb.append("________________________________________________________");
		sb.append(newLine);
		
		sb.append("Flight number\t\t: ");
		sb.append(this.getFlightNumber());
		sb.append(newLine);
		
		sb.append("Airline (carrier)\t: ");
		sb.append(this.getAirline());
		sb.append(newLine);
		
		sb.append("Departure time\t\t: ");
		sb.append(this.getDepartureTime());
		sb.append(newLine);
		
		sb.append("Destination\t\t: ");
		sb.append(this.destination);
		sb.append(newLine);
		
		
		sb.append("Airport code\t\t: ");
		sb.append(this.airportCode);
		sb.append(newLine);
		
		
		sb.append("Country\t\t\t: ");
		sb.append(this.country);
		sb.append(newLine);
		
		sb.append("Gate\t\t\t: ");
		sb.append(this.gate);
		sb.append(newLine);
		
		sb.append("Boarding status\t\t: ");
		if(this.boardingStatus != null) {
			sb.append(this.boardingStatus.getColouredStatus());
		}
		sb.append(newLine);
		
		sb.append("Passenger numbers\t: ");
		sb.append(this.passengerNumber);
		sb.append(newLine);
		
		sb.append("________________________________________________________");
		
		
		return sb.toString();
	}
	
	/**
	 * cancels the flight of the commercialflight object this method is called on
	 */
	public void cancelFlight() {
		// probably modify boarding status
		this.boardingStatus = BoardingStatus.CANCELLED;
	}
	
	
	/**
	 * delays a flight to the time passed as argument - sets its BoardingStatus to DELAYED
	 * @param newTime - new time to be set
	 */
	public void delayFlightToTime(LocalTime newTime) {
		
		this.setDepartureTime(newTime);
		this.setBoardingStatus(BoardingStatus.DELAYED);
		System.out.println("Flight : " + this.getFlightNumber() + " delayed until " + this.getDepartureTime().toString() );
		
		
	}


	

	
	
	
	



	
}
