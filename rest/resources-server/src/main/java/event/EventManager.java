package event;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

import util.JPAUtil;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import java.util.Date;
import java.util.List;

public class EventManager {

    public static void main(String[] args) {
        EventManager mgr = new EventManager();

        if (args[0].equals("store")) {
            mgr.createAndStoreEvent("My Event", new Date(), assemble(args));
        } else if (args[0].equals("find")) {
            List<Event> events = mgr.find(args[1]);
            for (int i = 0; i < events.size(); i++) {
                Event event = events.get(i);
                System.out.println("Event: " + event.getTitle() +
                        ", Time: " + event.getDate() +
                        ", Location: " + event.getLocation());
            }
        }
        JPAUtil.close();
    }

    private void createAndStoreEvent(String title, Date theDate, String wktPoint) {
        Geometry geom = wktToGeometry(wktPoint);

        if (!geom.getGeometryType().equals("Point")) {
            throw new RuntimeException("Geometry must be a point. Got a " + geom.getGeometryType());
        }

        EntityManager em = JPAUtil.createEntityManager();

        em.getTransaction().begin();

        Event theEvent = new Event();
        theEvent.setTitle(title);
        theEvent.setDate(theDate);
        theEvent.setLocation((Point) geom);
        em.persist(theEvent);
        em.getTransaction().commit();
        em.close();
    }
    
    @SuppressWarnings("unchecked")
	private List<Event> find(String wktFilter) {
        Geometry filter = wktToGeometry(wktFilter);
        EntityManager em = JPAUtil.createEntityManager();
        em.getTransaction().begin();
        Query query = em.createQuery("select e from Event e where within(e.location, :filter) = true", Event.class);
        query.setParameter("filter", filter);
        return query.getResultList();
    }
    private Geometry wktToGeometry(String wktPoint) {
        WKTReader fromText = new WKTReader();
        Geometry geom = null;
        try {
            geom = fromText.read(wktPoint);
        } catch (ParseException e) {
            throw new RuntimeException("Not a WKT string:" + wktPoint);
        }
        return geom;
    }

    /**
     * Utility method to assemble all arguments save the first into a String
     */
    private static String assemble(String[] args) {
        StringBuilder builder = new StringBuilder();
        for (int i = 1; i < args.length; i++) {
            builder.append(args[i]).append(" ");
        }
        return builder.toString();
    }
}