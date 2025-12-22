export function GrooveSellTracking({ id }: { id: string }) {
    if (!id) return null;
    return (
        <img
            src={`https://tracking.groovesell.com/salespage/tracking/${id}`}
            style={{ border: '0px', width: '0px', height: '0px', position: 'absolute', top: 0, left: 0 }}
            alt=""
        />
    );
}
