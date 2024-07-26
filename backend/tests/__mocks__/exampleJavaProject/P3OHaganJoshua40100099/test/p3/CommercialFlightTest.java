package p3;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CommercialFlightTest {

	// test data declarations

	String validFlightNumber;
	String validAirline;
	LocalTime validDepartureTime;
	String validDestination;
	
	// test getters and setters josh!!!
	String validAirportCode;
	String validCountry;
	String validGate;

	BoardingStatus validBoardingStatusOpen;

	int validPassengerNumber;

	CommercialFlight testCommercialFlight;

	@BeforeEach
	void setUp() throws Exception {

		validFlightNumber = "ABC130";
		validAirline = "Delta Airlines";

		validDepartureTime = LocalTime.of(8, 0);

		validDestination = "London";

		validAirportCode = "LHR";

		validCountry = "UK";

		validGate = "A1";

		validBoardingStatusOpen = BoardingStatus.DELAYED;

		validPassengerNumber = 180;

		testCommercialFlight = new CommercialFlight();

	}

	@Test
	void testCommercialFlight() {

		testCommercialFlight = new CommercialFlight();
		assertEquals(CommercialFlight.class, testCommercialFlight.getClass());
	}

	@Test
	void testGetFlightNumber() {
		testCommercialFlight.setFlightNumber(validFlightNumber);
		assertEquals(validFlightNumber, testCommercialFlight.getFlightNumber());

	}

	@Test
	void testGetAirline() {
		testCommercialFlight.setAirline(validAirline);
		assertEquals(validAirline, testCommercialFlight.getAirline());
	}

	@Test
	void testGetDepartureTime() {
		testCommercialFlight.setDepartureTime(validDepartureTime);
		assertEquals(validDepartureTime, testCommercialFlight.getDepartureTime());
	}

	@Test
	void testGetDestination() {
		testCommercialFlight.setDestination(validDestination);
		assertEquals(validDestination, testCommercialFlight.getDestination());
	}

	@Test
	void testGetCountry() {
		testCommercialFlight.setCountry(validCountry);
		assertEquals(validCountry, testCommercialFlight.getCountry());
	}

	@Test
	void testGetGate() {
		testCommercialFlight.setGate(validGate);
		assertEquals(validGate, testCommercialFlight.getGate());
	}

	@Test
	void testGetBoardingStatus() {
		testCommercialFlight.setBoardingStatus(validBoardingStatusOpen);
		assertEquals(validBoardingStatusOpen, testCommercialFlight.getBoardingStatus());
	}

	@Test
	void testGetPassengerNumber() {
		testCommercialFlight.setPassengerNumber(validPassengerNumber);
		assertEquals(validPassengerNumber, testCommercialFlight.getPassengerNumber());
	}

	@Test
	void testCommercialFlightStringStringLocalTimeStringStringStringBoardingStatusInt() {

		
		
		testCommercialFlight = new CommercialFlight(validFlightNumber, validAirline, validDepartureTime, validDestination, validCountry, validGate, validAirportCode, validBoardingStatusOpen, validPassengerNumber);
		assertEquals(validFlightNumber, testCommercialFlight.getFlightNumber());
		assertEquals(validAirline, testCommercialFlight.getAirline());
		assertEquals(validDepartureTime, testCommercialFlight.getDepartureTime());
		assertEquals(validDestination, testCommercialFlight.getDestination());

		assertEquals(validAirportCode, testCommercialFlight.getAirportCode());
		assertEquals(validCountry, testCommercialFlight.getCountry());
		assertEquals(validGate, testCommercialFlight.getGate());
		assertEquals(validBoardingStatusOpen, testCommercialFlight.getBoardingStatus());
		assertEquals(validPassengerNumber, testCommercialFlight.getPassengerNumber());

	}

	@Test
	void testCancelFlight() {
		// set boarding status to open!
		testCommercialFlight.setBoardingStatus(validBoardingStatusOpen);
		
		// assert!
		assertEquals(validBoardingStatusOpen, testCommercialFlight.getBoardingStatus());
		
		
		// cancel the flight!
		testCommercialFlight.cancelFlight();
		
		// assert that the change has taken place!
		assertEquals(BoardingStatus.CANCELLED, testCommercialFlight.getBoardingStatus());
	}

	@Test
	void testToString() {
		// implement when we know more!
	}
}
