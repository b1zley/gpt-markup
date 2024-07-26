package p3;

import java.util.Comparator;

public class FlightComparatorTimeAsc implements Comparator<Flight> {

	@Override
	public int compare(Flight o1, Flight o2) {
		return o1.getDepartureTime().compareTo(o2.getDepartureTime());
	}

}
