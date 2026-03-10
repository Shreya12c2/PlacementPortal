export default function StudentInterviewPrep() {
  const resources = [
    {
      title: "Aptitude Practice (IndiaBix)",
      link: "https://www.indiabix.com/aptitude/questions-and-answers/",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "Coding Practice (LeetCode)",
      link: "https://leetcode.com/problemset/all/",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Interview Questions (GeeksforGeeks)",
      link: "https://www.geeksforgeeks.org/interview-preparation/",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "HR Interview Questions",
      link: "https://www.ambitionbox.com/interviews/hr-interview-questions",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
        Interview Preparation
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {resources.map((r) => (
          <a
            key={r.title}
            href={r.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-6 rounded-lg shadow-sm ${r.color} hover:shadow-md transition`}
          >
            <h3 className="font-medium text-lg mb-2">{r.title}</h3>
            <p className="text-sm">Click to open resource</p>
          </a>
        ))}
      </div>
    </div>
  );
}
