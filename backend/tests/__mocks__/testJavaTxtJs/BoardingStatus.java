package p3;


/**
 * 40100099 joshua ohagan
 * Enum representing the fixed different kinds of enum which are possible
 */
public enum BoardingStatus {

	CLOSED,  BOARDING, NOT_STARTED, CANCELLED, DELAYED;

	/**
	 * helper method designed to convert a string to a BoardingStatus
	 * separation of concern here - BoardingStatus enum should manage what string constitutes
	 * which boarding status
	 * @param boardingStatusString - String - determines which BoardingStatus should be returned
	 * @return - BoardingStatus - selected boardingStatus to return
	 */
	public static BoardingStatus getBoardingStatusFromString(String boardingStatusString) {

		// override toString() later if i have time

		// for now hard code

		if (boardingStatusString.equalsIgnoreCase(CANCELLED.toString())) {

			return CANCELLED;
		} else if (boardingStatusString.equalsIgnoreCase("NOT STARTED")) {
			return NOT_STARTED;

		} else if (boardingStatusString.equalsIgnoreCase(BOARDING.toString())) {
			return BOARDING;
		}else if (boardingStatusString.equalsIgnoreCase(CLOSED.toString())) {
			return CLOSED;
		} else {
			return null;
		}

	}

	
	/**
	 * helper method which converts a BoardingStatus into a user friendly coloured string
	 * @return - userfriendly coloured String representation of the BoardingStatus
	 */
	public String getColouredStatus() {
		final String RED_UNICODE = "\033[0;31m";
		final String BLACK_UNICODE = "\033[0;30m";
		final String GREEN_UNICODE = "\033[0;32m";
		final String ORANGE_UNICODE = "\033[0;33m";
		
		switch (this) {

		case CANCELLED:
			return "CANCELLED";
			
			
		case NOT_STARTED:
			return "NOT_STARTED";
			
		case BOARDING:
			StringBuilder sb1 = new StringBuilder();
			sb1.append(GREEN_UNICODE);
			sb1.append("BOARDING");
			sb1.append(BLACK_UNICODE);
			return sb1.toString();
			
		
		case CLOSED:
			StringBuilder sb11 = new StringBuilder();
			sb11.append(RED_UNICODE);
			sb11.append("CLOSED");
			sb11.append(BLACK_UNICODE);

			return sb11.toString();

		case DELAYED:
			StringBuilder sb111 = new StringBuilder();
			sb111.append(ORANGE_UNICODE);
			sb111.append("DELAYED");
			sb111.append(BLACK_UNICODE);

			return sb111.toString();
		default:
			return null;

		}

	}

}
