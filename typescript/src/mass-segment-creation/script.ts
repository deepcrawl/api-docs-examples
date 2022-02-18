import { CreateCrawlUrlSegmentInput, Sdk } from "../sdk";

type OBJECT_ID = string | number;

const segmentsToCreate: Omit<CreateCrawlUrlSegmentInput, "projectId">[] = [
  {
    crawlUrlFilter: { _or: [{ _and: [{ url: { contains: ".com" } }] }] },
    name: "DotCom Segment", // Some unique name for your segment
  },
];

const ACCOUNT_ID = 21921;

async function fetchAllProjects(
  sdk: Sdk,
  accountId: OBJECT_ID,
  after?: string
): Promise<{ id: number | string; name: string }[]> {
  console.log(
    `=== Fetching projects for account ${accountId} after ${after ?? "-"}`
  );
  const projects = await sdk.masssegments_GetAccountProjects({
    accountId,
    after,
  });
  const hasNextPage = projects.getAccount?.projects.pageInfo.hasNextPage;
  if (hasNextPage) {
    const nextPage =
      projects.getAccount?.projects.pageInfo.endCursor ?? undefined;
    return [
      ...(projects.getAccount?.projects.nodes ?? []),
      ...(await fetchAllProjects(sdk, accountId, nextPage)),
    ];
  } else {
    return projects.getAccount?.projects.nodes ?? [];
  }
}

async function fetchAllSegmentNames(
  sdk: Sdk,
  project: { id: OBJECT_ID; name: string },
  after?: string
): Promise<string[]> {
  console.log(
    `=== Fetching segments for project ${project.name} after ${after ?? "-"}`
  );
  const projects = await sdk.masssegments_GetProjectSegments({
    projectId: project.id,
    after,
  });
  const hasNextPage = projects.getProject?.segments?.pageInfo.hasNextPage;
  if (hasNextPage) {
    const nextPage =
      projects.getProject?.segments?.pageInfo.endCursor ?? undefined;
    return [
      ...(projects.getProject?.segments?.nodes?.map(
        (segment) => segment.name
      ) ?? []),
      ...(await fetchAllSegmentNames(sdk, project, nextPage)),
    ];
  } else {
    return (
      projects.getProject?.segments?.nodes?.map((segment) => segment.name) ?? []
    );
  }
}

async function createMissingSegments(
  sdk: Sdk,
  project: { id: OBJECT_ID; name: string }
): Promise<void> {
  const existingSegmentNames = await fetchAllSegmentNames(sdk, project);
  let created = 0;
  for (const segment of segmentsToCreate) {
    if (!existingSegmentNames.includes(segment.name)) {
      console.log(
        `====== Creating segment ${segment.name} for project ${project.name}`
      );
      await sdk.masssegments_createSegment({
        input: {
          ...segment,
          projectId: project.id,
        },
      });
      created += 1;
    }
  }
  console.log(`= Finished creating segments for project ${project.name} (${created} created)`);
}

export async function run(sdk: Sdk): Promise<void> {
  const projects = await fetchAllProjects(sdk, ACCOUNT_ID);
  for (const project of projects) {
    await createMissingSegments(sdk, project);
  }
}
